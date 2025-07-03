import { useNavigate } from "react-router";
import { ColumnDef } from "@tanstack/react-table";
import ComponentCard from "../../components/common/ComponentCard";
import RowActionsMenu from "../../components/tableActions/RowActionsMenu";

type Instructors = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile: string;
};

const pageDetails = {
  title: "View Instructors",
  addPage: "instructors-form",
};

export default function InstructorsList() {
  const navigate = useNavigate();

  const handleDelete = (id: number, name: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmDelete) {
      console.log("Deleting instructor ID:", id);
      // TODO: Replace with actual delete API call
    }
  };

  const columns: ColumnDef<Instructors>[] = [
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
      accessorKey: "id",
      header: "ID",
    },
    {
      header: "Name",
      cell: ({ row }) => {
        const { first_name, last_name } = row.original;
        return `${first_name} ${last_name}`;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
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
            onDelete={() => handleDelete(instructor.id, instructor.first_name)}
          />
        );
      },
    },
  ];

  return (
    <div>
      <ComponentCard<Instructors>
        title={pageDetails.title}
        listAPI="InstructorsList"
        addPage={pageDetails.addPage}
        columns={columns}
      />
    </div>
  );
}