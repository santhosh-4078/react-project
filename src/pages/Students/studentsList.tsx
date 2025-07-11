import { useNavigate } from "react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import ComponentCard from "../../components/common/ComponentCard";
import RowActionsMenu from "../../components/tableActions/RowActionsMenu";
import { APICONSTANT } from "../../services/config";
import useDeleteMutation from "../../hooks/Mutations/useDeleteMutation";
import useReactQuery from "../../hooks/useReactQuery";

type Students = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile: string;
  batch_name: string;
};

interface Batches {
  id: number;
  text: string;
}

const pageDetails = {
  title: "Students",
  addPage: "students-form",
};

export default function StudentsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteMutation();
  const { data: batches = [] } = useReactQuery("BATCHES_DROPDOWN", "");

  const batchesOptions = [
    { value: "", label: "Select batch" },
    ...(batches?.datas ?? []).map((course: Batches) => ({ value: String(course.id), label: course.text })),
  ];
  const handleDelete = async (id: number) => {
    try {
      const apiUrl = `${APICONSTANT.DELETE_STUDENTS}/${id}`;
      const response = await deleteMutation.mutateAsync({
        url: { apiUrl },
      });
      if (response?.success) {
        await queryClient.invalidateQueries({
          queryKey: ["GET_STUDENTS"],
        });
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const columns: ColumnDef<Students>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "profile",
      header: "Profile",
      cell: ({ getValue }) => {
        const url = getValue() as string;
        return (
          <img
            src={url}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        );
      },
    },
    {
      header: "Name",
      cell: ({ row }) => {
        const { first_name, last_name } = row.original;
        return `${first_name} ${last_name}`;
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => (
        <span>{row?.original?.email || "---"}</span>
      )
    },
    {
      header: "Phone Number",
      accessorKey: "phone",
      cell: ({ row }) => (
        <span>{row?.original?.phone || "---"}</span>
      )
    },
    {
      header: "Batch Name",
      accessorKey: "batch_name",
      cell: ({ row }) => (
        <span>{row?.original?.batch_name || "---"}</span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <RowActionsMenu
            onEdit={() => navigate("students-form", { state: student })}
            onDelete={() => handleDelete(student.id)}
          />
        );
      },
    },
  ];

  return (
    <div>
      <ComponentCard<Students>
        title={pageDetails.title}
        listAPI="GET_STUDENTS"
        addPage={pageDetails.addPage}
        columns={columns}
        queryParams={{
          filter_name: "",
          filter_email: "",
          filter_batch_id: "",
        }}
        selectOptions={{
          filter_batch_id: batchesOptions,
        }}
      />
    </div>
  );
}
