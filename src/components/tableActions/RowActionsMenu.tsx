// src/components/common/RowActionsMenu.tsx

import { useState, useEffect, useRef } from "react";
import { PencilIcon, TrashBinIcon, MoreDotIcon } from "../../icons";

interface RowActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const RowActionsMenu: React.FC<RowActionsMenuProps> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        title="Actions"
      >
        <MoreDotIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900  border border-gray-200 dark:border-gray-600 rounded shadow-lg z-10">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <TrashBinIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default RowActionsMenu;