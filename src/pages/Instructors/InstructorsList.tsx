import ComponentCard from "../../components/common/ComponentCard";
import { ColumnDef } from "@tanstack/react-table";

type Instructors = {
  id: number;
  name: string;
  email: string;
}

const pageDetails = {
  title:"ViewInstructors",
  addPage: "instructors-form",
}

const columns: ColumnDef<Instructors>[] = [
  {
    accessorKey: "_id",
    header: "_id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
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
