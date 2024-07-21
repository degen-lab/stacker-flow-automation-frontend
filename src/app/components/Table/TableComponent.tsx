import { isCustomColumn, TableComponentProps } from "@/types/tableTypes";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Filter } from "./Filter";

export const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  data,
  columnVisibility,
  setColumnVisibility,
  filters,
  onFiltersChange,
  sorting,
  onSortingChange,
}) => {
  const table = useReactTable({
    columns,
    data,
    state: {
      columnVisibility,
      columnFilters: filters,
      sorting,
    },
    onColumnFiltersChange: onFiltersChange,
    onSortingChange: onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex flex-col items-center justify-center">
                    {typeof header.column.columnDef.header === "function"
                      ? header.column.columnDef.header(header.getContext())
                      : (header.column.columnDef.header as string)}
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "asc" ? (
                        <span>🔼</span>
                      ) : (
                        <span>🔽</span>
                      )
                    ) : (
                      ""
                    )}
                    {isCustomColumn(header.column) && (
                      <Filter column={header.column} />
                    )}{" "}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-white odd:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-500 border-b border-r text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-sm text-gray-500 border-b border-r text-center"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
