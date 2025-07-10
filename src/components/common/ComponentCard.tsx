import { useState } from "react";
import Button from "../ui/button/Button";
import TanstackTable from "../tables/TanstackTable/TanstackTable";
// import { ColumnDef } from "@tanstack/react-table";
import { ColumnWithMeta } from "../tables/TanstackTable/ColumnMetaTable";
import { APIKeys } from "../../services/config";
import Input from "../form/input/InputField";
import { useNavigate } from "react-router";

interface ComponentCardProps<T> {
  title: string;
  className?: string;
  desc?: string;
  listAPI?: APIKeys;
  addPage?: string;
  columns?: ColumnWithMeta<T>[];
  children?: React.ReactNode;
}

const ComponentCard = <T,>({
  title,
  desc = "",
  className = "",
  listAPI,
  columns,
  addPage,
  children,
}: ComponentCardProps<T>) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddPage = () => {
    if (addPage) navigate(addPage);
  };

  const params = new URLSearchParams();
  if (search) params.set("filter_name", search);
  const queryString = params.toString();

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-800  ${className}`}>
      <div className="px-6 py-5 flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white/90">{title}</h3>
          {desc && <p className="text-sm text-gray-500 dark:text-white/90">{desc}</p>}
        </div>
        {listAPI && columns && addPage && (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
            />
            <Button onClick={handleAddPage}>Add</Button>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        {listAPI && columns ? (
          <TanstackTable<T>
            listAPI={listAPI}
            columns={columns}
            queryString={queryString}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ComponentCard;