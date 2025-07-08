import { useNavigate } from "react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import ComponentCard from "../../components/common/ComponentCard";
import RowActionsMenu from "../../components/tableActions/RowActionsMenu";
import { APICONSTANT } from "../../services/config";
import usePostMutation from "../../hooks/Mutations/usePostMtation";

type Courses = {
  id: number;
  name: string;
  description: string;
};

const pageDetails = {
  title: "Courses",
  addPage: "courses-form",
};

export default function CoursesList() {
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
    if(response?.success) {
      await queryClient.invalidateQueries({
        queryKey: ["GET_COURSES"]
      })
    }
  } catch (error) {
    console.error("Error deleting instructor:", error);
  }
};

  const columns: ColumnDef<Courses>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const courses = row.original;
        return (
          <RowActionsMenu
            onEdit={() =>
              navigate("courses-form", { state: courses })
            }
            onDelete={() =>
              handleDelete(courses.id)
            }
          />
        );
      },
    },
  ];

  return (
    <div>
      <ComponentCard<Courses>
        title={pageDetails.title}
        listAPI="GET_COURSES"
        addPage={pageDetails.addPage}
        columns={columns}
      />
    </div>
  );
}