import { useState } from "react";
import Button from "../ui/button/Button";
import TanstackTable from "../tables/TanstackTable/TanstackTable";
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
  data?: T[];
  renderRow?: (item: T) => React.ReactNode;
  queryParams?: Record<string, string | number | undefined>;
}

const ComponentCard = <T,>({
  title,
  desc = "",
  className = "",
  listAPI,
  columns,
  addPage,
  children,
  data,
  renderRow,
  queryParams = {},
}: ComponentCardProps<T>) => {
  const navigate = useNavigate();

  // Create state for each query param field
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.keys(queryParams).forEach((key) => {
      initial[key] = queryParams[key]?.toString() ?? "";
    });
    return initial;
  });

  // Update filters on input change
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Build query string from filter state
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "") {
      params.set(key, value);
    }
  });
  const queryString = params.toString();

  // For static data filtering (if needed)
  const filteredData = data?.filter((item) =>
    Object.entries(filters).every(([key, val]) =>
      JSON.stringify(item).toLowerCase().includes(val.toLowerCase())
    )
  );

  const showSearchBar = (listAPI && columns && addPage) || (data && renderRow);

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-800 ${className}`}>
      <div className="px-6 py-5 flex justify-between items-start flex-wrap gap-2 sm:flex-nowrap sm:items-center sm:gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white/90">{title}</h3>
          {desc && <p className="text-sm text-gray-500 dark:text-white/90">{desc}</p>}
        </div>

        {showSearchBar && (
          <div className="flex flex-wrap items-center gap-2">
            {Object.keys(queryParams).map((key) => (
              <Input
                key={key}
                type="text"
                placeholder={key.replace("filter_", "").replace("_", " ").toUpperCase()}
                value={filters[key] || ""}
                onChange={(e) => handleFilterChange(key, e.target.value)}
              />
            ))}
            {addPage && <Button onClick={() => navigate(addPage)}>Add</Button>}
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
        ) : data && renderRow ? (
          <div className="space-y-2">
            {filteredData?.map((item, idx) => (
              <div key={idx}>{renderRow(item)}</div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ComponentCard;
