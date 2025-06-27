import ComponentCard from "../../components/common/ComponentCard";
import { ColumnDef } from "@tanstack/react-table";

type Student = {
  id: number;
  name: string;
  email: string;
};

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export default function StudentPage() {
  return (
    <ComponentCard<Student>
      title="Students"
      listAPI="viewUsers"
      columns={columns}
    />
  );
}