import ComponentCard from "../../components/common/ComponentCard";
import { ColumnDef } from "@tanstack/react-table";

type Instructors = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile: string;
};

const pageDetails = {
  title:"ViewInstructors",
  addPage: "instructors-form",
}

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
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
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
  
];

export default function InstructorsList() {
  return (
    <div>
      <ComponentCard
        title={pageDetails.title}
        listAPI="InstructorsList"
        addPage={pageDetails.addPage}
        columns={columns}
      />
    </div>
  )
}
