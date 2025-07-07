import { useNavigate } from "react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import ComponentCard from "../../components/common/ComponentCard";
import RowActionsMenu from "../../components/tableActions/RowActionsMenu";
import { APICONSTANT } from "../../services/config";
import usePostMutation from "../../hooks/Mutations/usePostMtation";

type Students = {
  id: number;
  name: string;
};

const pageDetails = {
  title: "View Students",
  addPage: "students-form",
};

export default function StudentsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMutation = usePostMutation();

  const handleDelete = async (id: number) => {
    try {
      const params = new URLSearchParams();
      params.append("user_group", "instructor");
      params.append("id", id.toString());

      const response = await deleteMutation.mutateAsync({
        url: { apiUrl: APICONSTANT.DELETE_COURSE },
        body: params,
      });
      if (response?.success) {
        await queryClient.invalidateQueries({
          queryKey: ["GET_COURSES"]
        })
      }
    } catch (error) {
      console.error("Error deleting instructor:", error);
    }
  };

  const columns: ColumnDef<Students>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      header: "Student Name",
      accessorKey: "name",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const Students = row.original;
        return (
          <RowActionsMenu
            onEdit={() =>
              navigate("students-form", { state: Students })
            }
            onDelete={() =>
              handleDelete(Students.id)
            }
          />
        );
      },
    },
  ];

  return (
    <div>
      <ComponentCard<Students>
        title={pageDetails.title}
        listAPI="GET_COURSES"
        addPage={pageDetails.addPage}
        columns={columns}
      />
    </div>
  );
}