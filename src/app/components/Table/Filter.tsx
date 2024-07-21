import { FilterProps, isCustomColumn, RowData } from "@/types/tableTypes";

export const Filter: React.FC<FilterProps<RowData>> = ({ column }) => {
  if (!isCustomColumn(column)) {
    return null;
  }

  const columnFilterValue = column.getFilterValue() as
    | string
    | number
    | [number, number];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.key === "Enter" && e.stopPropagation()}
      role="button"
      tabIndex={0}
      className="mt-2"
    >
      {column.columnDef.filterType === "number" ? (
        <div className="flex space-x-2">
          <input
            type="number"
            value={
              (columnFilterValue as [number, number] | undefined)?.[0] ?? ""
            }
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value,
                old?.[1],
              ])
            }
            placeholder={`Min`}
            className="w-24 border shadow rounded"
          />
          <input
            type="number"
            value={
              (columnFilterValue as [number, number] | undefined)?.[1] ?? ""
            }
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value,
              ])
            }
            placeholder={`Max`}
            className="w-24 border shadow rounded"
          />
        </div>
      ) : (
        <input
          type="text"
          value={(columnFilterValue as string | undefined) ?? ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search...`}
          className="w-36 border shadow rounded"
        />
      )}
    </div>
  );
};
