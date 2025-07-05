import ComponentCard from "../../components/common/ComponentCard";
import { ColumnDef } from "@tanstack/react-table";

type Student = {
  id: number;
  name: string;
  email: string;
};

const columns: ColumnDef<Student>[] = [
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

export default function StudentPage() {
  return (
    <ComponentCard<Student>
      title="Students"
      // listAPI="viewUsers"
      columns={columns}
    />
  );
}
