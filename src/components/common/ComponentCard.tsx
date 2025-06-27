import { useState } from "react";
import Button from "../ui/button/Button";
import TanstackTable from "../tables/TanstackTable/TanstackTable";
import { ColumnDef } from "@tanstack/react-table";
import { APIKeys } from "../../services/config";
import Input from "../form/input/InputField";

interface ComponentCardProps<T> {
  title: string;
  className?: string;
  desc?: string;
  listAPI: APIKeys;
  columns: ColumnDef<T, unknown>[];
}

const ComponentCard = <T,>({
  title,
  desc = "",
  className = "",
  listAPI,
  columns,
}: ComponentCardProps<T>) => {
  const [search, setSearch] = useState("");

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white ${className}`}>
      <div className="px-6 py-5 flex justify-between items-center">
        <div>
          <h3 className="text-base font-medium text-gray-800">{title}</h3>
          {desc && <p className="text-sm text-gray-500">{desc}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
          />
          <Button>Add</Button>
        </div>
      </div>
      <div className="p-4 border-t sm:p-6">
        <TanstackTable<T>
          listAPI={listAPI}
          columns={columns}
          queryString={`search=${encodeURIComponent(search)}`}
        />
      </div>
    </div>
  );
};

export default ComponentCard;