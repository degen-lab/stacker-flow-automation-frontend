"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  GET_BITCOIN_ADDRESS_EXPLORER_URL,
  GET_STACKS_ADDRESS_EXPLORER_URL,
  GET_TRANSACTION_EXPLORER_URL,
} from "@/app/consts";

const fetchTableData = async (url, setData, setLoading, setError) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const transformedData = {};
    for (const key in response.data) {
      if (Array.isArray(response.data[key])) {
        transformedData[key] = response.data[key].map((row) => ({
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
    setError(error);
    setLoading(false);
  }
};

const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = Array.from(
    column.getFacetedUniqueValues().keys()
  ).sort();
  return (
    <div onClick={(e) => e.stopPropagation()} className="mt-2">
      {column.columnDef.filterType === "number" ? (
        <div className="flex space-x-2">
          <input
            type="number"
            value={columnFilterValue?.[0] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old) => [e.target.value, old?.[1]])
            }
            placeholder={`Min`}
            className="w-24 border shadow rounded"
          />
          <input
            type="number"
            value={columnFilterValue?.[1] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old) => [old?.[0], e.target.value])
            }
            placeholder={`Max`}
            className="w-24 border shadow rounded"
          />
        </div>
      ) : column.columnDef.filterType === "select" ? (
        <select
          value={columnFilterValue ?? ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="w-36 border shadow rounded"
        >
          <option value="">All</option>
          {sortedUniqueValues.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={columnFilterValue ?? ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search...`}
          className="w-36 border shadow rounded"
        />
      )}
    </div>
  );
};

const TableComponent = ({
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

  const handleColumnToggle = (columnId) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
                    <Filter column={header.column} />
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
                  data-label={cell.column.columnDef.header}
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

export const Landing = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("acceptedDelegations");
  const [columnVisibilityMap, setColumnVisibilityMap] = useState({});
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  useEffect(() => {
    fetchTableData("http://localhost:8080/data", setData, setLoading, setError);
  }, []);

  useEffect(() => {
    // Initialize column visibility for each tab if not already done
    if (!columnVisibilityMap[activeTab]) {
      const columns = columnsMap[activeTab];
      const initialVisibility = {};
      columns.forEach((column) => {
        initialVisibility[column.accessorKey] = true;
      });
      setColumnVisibilityMap((prev) => ({
        ...prev,
        [activeTab]: initialVisibility,
      }));
    }
  }, [activeTab]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const columnsMap = {
    acceptedDelegations: [
      {
        header: "Stacker",
        accessorKey: "stacker",
        filterType: "text",
        cell: ({ getValue }) => {
          const stacker = getValue();
          if (!stacker) return "";
          const shortStacker = `${stacker.slice(0, 3)}...${stacker.slice(-3)}`;
          return (
            <a
              href={GET_STACKS_ADDRESS_EXPLORER_URL(stacker)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
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
          const poxAddress = getValue();
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
              className="text-blue-600 hover:underline"
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
          return formatNumber(getValue());
        },
      },
    ],
    pendingTransactions: [
      {
        header: "Transaction ID",
        accessorKey: "txid",
        filterType: "text",
        cell: ({ getValue }) => {
          const txid = getValue();
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
          const stacker = getValue();
          if (!stacker) return "";
          const shortStacker = `${stacker.slice(0, 3)}...${stacker.slice(-3)}`;
          return (
            <a
              href={GET_STACKS_ADDRESS_EXPLORER_URL(stacker)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
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
          const poxAddress = getValue();
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
              className="text-blue-600 hover:underline"
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
          const stacker = getValue();
          if (!stacker) return "";
          const shortStacker = `${stacker.slice(0, 3)}...${stacker.slice(-3)}`;
          return (
            <a
              href={GET_STACKS_ADDRESS_EXPLORER_URL(stacker)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
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
          const poxAddress = getValue();
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
              className="text-blue-600 hover:underline"
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
          return formatNumber(getValue());
        },
      },
    ],
    previousDelegations: [
      {
        header: "Stacker",
        accessorKey: "stacker",
        filterType: "text",
        cell: ({ getValue }) => {
          const stacker = getValue();
          if (!stacker) return "";
          const shortStacker = `${stacker.slice(0, 3)}...${stacker.slice(-3)}`;
          return (
            <a
              href={GET_STACKS_ADDRESS_EXPLORER_URL(stacker)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
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
          const poxAddress = getValue();
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
              className="text-blue-600 hover:underline"
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
          return formatNumber(getValue());
        },
      },
    ],
    committedDelegations: [
      {
        header: "POX Address",
        accessorKey: "poxAddress",
        filterType: "text",
        cell: ({ getValue }) => {
          const poxAddress = getValue();
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
              className="text-blue-600 hover:underline"
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
          return formatNumber(getValue());
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
            [activeTab]: visibility,
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
      {" "}
      {/* Updated classes for Flexbox layout */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowColumnToggle(!showColumnToggle)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Manage Column Visibility
        </button>
        {showColumnToggle && (
          <div className="flex overflow-x-auto space-x-4">
            {columnsMap[activeTab]?.map((column) => (
              <label
                key={column.accessorKey}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={columnVisibilityMap[activeTab]?.[column.accessorKey]}
                  onChange={() => {
                    setColumnVisibilityMap((prev) => ({
                      ...prev,
                      [activeTab]: {
                        ...prev[activeTab],
                        [column.accessorKey]:
                          !prev[activeTab][column.accessorKey],
                      },
                    }));
                  }}
                />
                <span>{column.header}</span>
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
      <div className="flex-1 overflow-y-auto pb-12">{renderTable()}</div>{" "}
      {/* Updated class for scrollable container */}
    </div>
  );
};
