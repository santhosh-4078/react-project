import { useNavigate } from "react-router";
// import { ColumnDef } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import ComponentCard from "../../components/common/ComponentCard";
import RowActionsMenu from "../../components/tableActions/RowActionsMenu";
import { APICONSTANT } from "../../services/config";
import usePostMutation from "../../hooks/Mutations/usePostMtation";
import { ColumnWithMeta } from "../../components/tables/TanstackTable/ColumnMetaTable";

type Instructors = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile: string;
};

const pageDetails = {
  title: "Instructors",
  addPage: "instructors-form",
};

export default function InstructorsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //initialize delete mutation hook
  const deleteMutation = usePostMutation();

  const handleDelete = async (id: number) => {
    try {
      const params = new URLSearchParams();
      params.append("user_group", "instructor");
      params.append("id", id.toString());

      const response = await deleteMutation.mutateAsync({
        url: { apiUrl: APICONSTANT.DELETE_INSTRUCTOR },
        body: params,
      });

      if (response?.success) {
        await queryClient.invalidateQueries({
          queryKey: ["GET_INSTRUCTOR"]
        })
      }

    } catch (error) {
      console.error("Error deleting instructor:", error);
    }
  };

  const columns: ColumnWithMeta<Instructors>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span>{row?.original?.id || "---"}</span>
      )
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
      accessorKey: "name",
      header: "Name",
      meta: {
        showFilter: "filter_name",
      },
      cell: ({ row }) => {
        const { first_name, last_name } = row.original;
        return `${first_name} ${last_name}`;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: {
        showFilter: "filter_email",
      },
      cell: ({ row }) => (
        <span>{row?.original?.email || "---"}</span>
      )
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span>{row?.original?.phone || "---"}</span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const instructor = row.original;
        return (
          <RowActionsMenu
            onEdit={() =>
              navigate("instructors-form", { state: instructor })
            }
            onDelete={() =>
              handleDelete(instructor.id)
            }
          />
        );
      },
    },
  ];

  return (
    <div>
      <ComponentCard<Instructors>
        title={pageDetails.title}
        listAPI="GET_INSTRUCTOR"
        addPage={pageDetails.addPage}
        columns={columns}
         queryParams={{
          filter_name: "",
          filter_email: "",
        }}
      />
    </div>
  );
}