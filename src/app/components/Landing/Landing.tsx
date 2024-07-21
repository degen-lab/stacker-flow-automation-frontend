"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  Column,
} from "@tanstack/react-table";
import {
  GET_BITCOIN_ADDRESS_EXPLORER_URL,
  GET_STACKS_ADDRESS_EXPLORER_URL,
  GET_TRANSACTION_EXPLORER_URL,
} from "@/app/consts";

// Define types for your data
interface RowData {
  stacker: string;
  startCycle: number;
  endCycle: number;
  poxAddress: string;
  amountUstx: number;
  amountStx: number;
  txid: string;
  functionName: string;
  rewardCycle: number;
  rewardIndex: number;
}

type CustomColumnDef<TData> = ColumnDef<TData> & {
  filterType?: "text" | "number" | "select";
  accessorKey?: string;
};

// interface CustomColumn<TData> extends Column<TData, unknown> {
//   columnDef: CustomColumnDef<TData>;
//   getFilterValue: () =>
//     | string
//     | number
//     | readonly string[]
//     | [string, string]
//     | undefined;
//   setFilterValue: (
//     value: string | number | readonly string[] | [string, string] | undefined
//   ) => void;
// }

function isCustomColumn<TData>(
  column: Column<TData, unknown>
): column is Column<TData, unknown> & {
  columnDef: CustomColumnDef<TData>;
  getFilterValue: () => string | number;
  setFilterValue: (value: string | number) => void;
} {
  return (
    "getFilterValue" in column &&
    "setFilterValue" in column &&
    "columnDef" in column
  );
}

interface FilterProps<TData> {
  column: Column<TData, unknown> & {
    columnDef: CustomColumnDef<TData>;
    getFilterValue: () => string | number | readonly string[] | undefined;
    setFilterValue: (
      value: string | number | readonly string[] | undefined
    ) => void;
  };
}

interface TableComponentProps {
  columns: CustomColumnDef<RowData>[];
  data: RowData[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

const fetchTableData = async (
  url: string,
  setData: React.Dispatch<
    React.SetStateAction<Record<string, RowData[]> | null>
  >,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>
) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const transformedData: Record<string, RowData[]> = {};
    for (const key in response.data) {
      if (Array.isArray(response.data[key])) {
        transformedData[key] = response.data[key].map((row: RowData) => ({
          ...row,
          amountStx: row.amountUstx / 10 ** 6,
        }));
      } else {
        transformedData[key] = response.data[key];
      }
    }
    setData(transformedData);
    setLoading(false);
  } catch (error) {
    setError(error as Error);
    setLoading(false);
  }
};

const Filter: React.FC<FilterProps<RowData>> = ({ column }) => {
  if (!isCustomColumn(column)) {
    return null;
  }

  const columnFilterValue = column.getFilterValue() as
    | string
    | number
    | readonly string[]
    | [number, number]
    | undefined;

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

const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  data,
  columnVisibility,
  setColumnVisibility,
}) => {
  const table = useReactTable({
    columns,
    data,
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="flex-1 overflow-y-auto pb-12">
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
                    {typeof header.column.columnDef.header === "function" ? (
                      header.column.columnDef.header(header.getContext())
                    ) : (
                      <span>{header.column.columnDef.header}</span>
                    )}
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
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-white odd:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 text-sm text-gray-500 border-b border-r text-center"
                  data-label={cell.column.columnDef.header as string}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Landing: React.FC = () => {
  const [data, setData] = useState<Record<string, RowData[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState("acceptedDelegations");
  const [columnVisibilityMap, setColumnVisibilityMap] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  // update name to Hide Column Visibility Settings
  useEffect(() => {
    fetchTableData("http://localhost:8080/data", setData, setLoading, setError);
  }, []);

  useEffect(() => {
    if (!columnVisibilityMap[activeTab]) {
      const columns = columnsMap[activeTab];
      const initialVisibility: Record<string, boolean> = {};
      columns.forEach((column) => {
        initialVisibility[column.accessorKey as string] = true;
      });
      setColumnVisibilityMap((prev) => ({
        ...prev,
        [activeTab]: initialVisibility,
      }));
    }
  }, [activeTab]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const columnsMap: Record<string, CustomColumnDef<RowData>[]> = {
    acceptedDelegations: [
      {
        header: "Stacker",
        accessorKey: "stacker",
        filterType: "text",
        cell: ({ getValue }) => {
          const stacker = getValue<string>();
          if (!stacker) return "";
          const shortStacker = `${stacker.slice(0, 3)}...${stacker.slice(-3)}`;
          return (
            <a
              href={GET_STACKS_ADDRESS_EXPLORER_URL(stacker)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              {shortStacker}
            </a>
          );
        },
      },
      {
        header: "Start Cycle",
        accessorKey: "startCycle",
        filterType: "number",
      },
      { header: "End Cycle", accessorKey: "endCycle", filterType: "number" },
      {
        header: "POX Address",
        accessorKey: "poxAddress",
        filterType: "text",
        cell: ({ getValue }) => {
          const poxAddress = getValue<string>();
          if (!poxAddress) return "";
          const shortPoxAddress = `${poxAddress.slice(
            0,
            3
          )}...${poxAddress.slice(-3)}`;
          return (
            <a
              href={GET_BITCOIN_ADDRESS_EXPLORER_URL(poxAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              {shortPoxAddress}
            </a>
          );
        },
      },
      {
        header: "Amount STX",
        accessorKey: "amountStx",
        filterType: "number",
        cell: ({ getValue }) => {
          return formatNumber(getValue<number>());
        },
      },
    ],
    pendingTransactions: [
      {
        header: "Transaction ID",
        accessorKey: "txid",
        filterType: "text",
        cell: ({ getValue }) => {
          const txid = getValue<string>();
          const shortTxid = `${txid.slice(0, 3)}...${txid.slice(-3)}`;
          return (
            <a
              href={GET_TRANSACTION_EXPLORER_URL(txid)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {shortTxid}
            </a>
          );
        },
      },
      {
        header: "Function Name",
        accessorKey: "functionName",
        filterType: "text",
        cell: ({ getValue }) => getValue(),
      },
      {
        header: "Stacker",
        accessorKey: "stacker",
        filterType: "text",
        cell: ({ getValue }) => {
          const stacker = getValue<string>();
          if (!stacker) return "";
          const shortStacker = `${stacker.slice(0, 3)}...${stacker.slice(-3)}`;
          return (
            <a
              href={GET_STACKS_ADDRESS_EXPLORER_URL(stacker)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              {shortStacker}
            </a>
          );
        },
      },
      {
        header: "POX Address",
        accessorKey: "poxAddress",
        filterType: "text",
        cell: ({ getValue }) => {
          const poxAddress = getValue<string>();
          if (!poxAddress) return "";
          const shortPoxAddress = `${poxAddress.slice(
            0,
            3
          )}...${poxAddress.slice(-3)}`;
          return (
            <a
              href={GET_BITCOIN_ADDRESS_EXPLORER_URL(poxAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              {shortPoxAddress}
            </a>
          );
        },
      },
      {
        header: "Start Cycle",
        accessorKey: "startCycle",
        filterType: "number",
      },
      { header: "End Cycle", accessorKey: "endCycle", filterType: "number" },
      {
        header: "Reward Cycle",
        accessorKey: "rewardCycle",
        filterType: "number",
      },
      {
        header: "Reward Index",
        accessorKey: "rewardIndex",
        filterType: "number",
      },
    ],
    delegations: [
      {
        header: "Stacker",
        accessorKey: "stacker",
        filterType: "text",
        cell: ({ getValue }) => {
          const stacker = getValue<string>();
          if (!stacker) return "";
          const shortStacker = `${stacker.slice(0, 3)}...${stacker.slice(-3)}`;
          return (
            <a
              href={GET_STACKS_ADDRESS_EXPLORER_URL(stacker)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              {shortStacker}
            </a>
          );
        },
      },
      {
        header: "Start Cycle",
        accessorKey: "startCycle",
        filterType: "number",
      },
      { header: "End Cycle", accessorKey: "endCycle", filterType: "number" },
      {
        header: "POX Address",
        accessorKey: "poxAddress",
        filterType: "text",
        cell: ({ getValue }) => {
          const poxAddress = getValue<string>();
          if (!poxAddress) return "";
          const shortPoxAddress = `${poxAddress.slice(
            0,
            3
          )}...${poxAddress.slice(-3)}`;
          return (
            <a
              href={GET_BITCOIN_ADDRESS_EXPLORER_URL(poxAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              {shortPoxAddress}
            </a>
          );
        },
      },
      {
        header: "Amount STX",
        accessorKey: "amountStx",
        filterType: "number",
        cell: ({ getValue }) => {
          return formatNumber(getValue<number>());
        },
      },
    ],
    previousDelegations: [
      {
        header: "Stacker",
        accessorKey: "stacker",
        filterType: "text",
        cell: ({ getValue }) => {
          const stacker = getValue<string>();
          if (!stacker) return "";
          const shortStacker = `${stacker.slice(0, 3)}...${stacker.slice(-3)}`;
          return (
            <a
              href={GET_STACKS_ADDRESS_EXPLORER_URL(stacker)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              {shortStacker}
            </a>
          );
        },
      },
      {
        header: "Start Cycle",
        accessorKey: "startCycle",
        filterType: "number",
      },
      { header: "End Cycle", accessorKey: "endCycle", filterType: "number" },
      {
        header: "POX Address",
        accessorKey: "poxAddress",
        filterType: "text",
        cell: ({ getValue }) => {
          const poxAddress = getValue<string>();
          if (!poxAddress) return "";
          const shortPoxAddress = `${poxAddress.slice(
            0,
            3
          )}...${poxAddress.slice(-3)}`;
          return (
            <a
              href={GET_BITCOIN_ADDRESS_EXPLORER_URL(poxAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              {shortPoxAddress}
            </a>
          );
        },
      },
      {
        header: "Amount STX",
        accessorKey: "amountStx",
        filterType: "number",
        cell: ({ getValue }) => {
          return formatNumber(getValue<number>());
        },
      },
    ],
    committedDelegations: [
      {
        header: "POX Address",
        accessorKey: "poxAddress",
        filterType: "text",
        cell: ({ getValue }) => {
          const poxAddress = getValue<string>();
          if (!poxAddress) return "";
          const shortPoxAddress = `${poxAddress.slice(
            0,
            3
          )}...${poxAddress.slice(-3)}`;
          return (
            <a
              href={GET_BITCOIN_ADDRESS_EXPLORER_URL(poxAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              {shortPoxAddress}
            </a>
          );
        },
      },
      {
        header: "Start Cycle",
        accessorKey: "startCycle",
        filterType: "number",
      },
      { header: "End Cycle", accessorKey: "endCycle", filterType: "number" },
      {
        header: "Amount STX",
        accessorKey: "amountStx",
        filterType: "number",
        cell: ({ getValue }) => {
          return formatNumber(getValue<number>());
        },
      },
      {
        header: "Reward Index",
        accessorKey: "rewardIndex",
        filterType: "number",
      },
    ],
  };

  const renderTable = () => {
    if (!data || !data[activeTab] || !columnVisibilityMap[activeTab])
      return null;

    return (
      <TableComponent
        columns={columnsMap[activeTab]}
        data={data[activeTab]}
        columnVisibility={columnVisibilityMap[activeTab]}
        setColumnVisibility={(visibility) =>
          setColumnVisibilityMap((prev) => ({
            ...prev,
            [activeTab]: visibility as Record<string, boolean>,
          }))
        }
      />
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowColumnToggle(!showColumnToggle)}
          className="bg-orange-500 text-white px-4 py-2 rounded-md"
        >
          Show Column Visibility Settings
        </button>
        {showColumnToggle && (
          <div className="flex overflow-x-auto space-x-4">
            {columnsMap[activeTab]?.map((column) => (
              <label
                key={column.accessorKey as string}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={
                    columnVisibilityMap[activeTab]?.[
                      column.accessorKey as string
                    ]
                  }
                  onChange={() => {
                    setColumnVisibilityMap((prev) => ({
                      ...prev,
                      [activeTab]: {
                        ...prev[activeTab],
                        [column.accessorKey as string]:
                          !prev[activeTab][column.accessorKey as string],
                      },
                    }));
                  }}
                />
                <span>{column.header?.toString()}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <ul className="flex border-b mb-4 overflow-x-auto whitespace-nowrap">
        {Object.keys(columnsMap).map((tab) => (
          <li
            key={tab}
            onClick={() => setActiveTab(tab)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTab(tab);
              }
            }}
            role="tab"
            tabIndex={0}
            className={`cursor-pointer mr-4 px-4 py-2 text-center ${
              activeTab === tab ? "border-b-2 border-black" : ""
            }`}
          >
            {tab
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </li>
        ))}
      </ul>
      <div className="flex-1 overflow-y-auto pb-12">{renderTable()}</div>
    </div>
  );
};
