"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
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
    setData(response.data);
    setLoading(false);
  } catch (error) {
    setError(error);
    setLoading(false);
  }
};

const TableComponent = ({ columns, data }) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
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
                  className="px-6 py-4 text-sm text-gray-500 border-b"
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

  useEffect(() => {
    fetchTableData("http://localhost:8080/data", setData, setLoading, setError);
  }, []);

  const columnsMap = {
    acceptedDelegations: [
      {
        header: "Stacker",
        accessorKey: "stacker",
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
      { header: "Start Cycle", accessorKey: "startCycle" },
      { header: "End Cycle", accessorKey: "endCycle" },
      {
        header: "POX Address",
        accessorKey: "poxAddress",
        cell: ({ getValue }) => {
          const poxAddress = getValue();
          if (!poxAddress) return "";
          const shortPoxAddress = `${poxAddress.slice(
            0,
            3
          )}...${poxAddress.slice(-3)}`;
          return (
            <a
              href={`${GET_BITCOIN_ADDRESS_EXPLORER_URL(poxAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {shortPoxAddress}
            </a>
          );
        },
      },
      { header: "Amount USTX", accessorKey: "amountUstx" },
    ],
    pendingTransactions: [
      {
        header: "Transaction ID",
        accessorKey: "txid",
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
      { header: "Function Name", accessorKey: "functionName" },
      {
        header: "Stacker",
        accessorKey: "stacker",
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
      { header: "Start Cycle", accessorKey: "startCycle" },
      { header: "End Cycle", accessorKey: "endCycle" },
      { header: "Reward Cycle", accessorKey: "rewardCycle" },
      { header: "Reward Index", accessorKey: "rewardIndex" },
    ],
    delegations: [
      {
        header: "Stacker",
        accessorKey: "stacker",
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
      { header: "Start Cycle", accessorKey: "startCycle" },
      { header: "End Cycle", accessorKey: "endCycle" },
      {
        header: "POX Address",
        accessorKey: "poxAddress",
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
      { header: "Amount USTX", accessorKey: "amountUstx" },
    ],
    previousDelegations: [
      {
        header: "Stacker",
        accessorKey: "stacker",
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
      { header: "Start Cycle", accessorKey: "startCycle" },
      { header: "End Cycle", accessorKey: "endCycle" },
      {
        header: "POX Address",
        accessorKey: "poxAddress",
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
      { header: "Amount USTX", accessorKey: "amountUstx" },
    ],
    committedDelegations: [
      {
        header: "POX Address",
        accessorKey: "poxAddress",
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
      { header: "Start Cycle", accessorKey: "startCycle" },
      { header: "End Cycle", accessorKey: "endCycle" },
      { header: "Amount USTX", accessorKey: "amountUstx" },
      { header: "Reward Index", accessorKey: "rewardIndex" },
    ],
  };

  const renderTable = () => {
    if (!data) return null;

    return (
      <TableComponent
        columns={columnsMap[activeTab]}
        data={data[activeTab] || []}
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
    <div className="p-4">
      <ul className="flex border-b mb-4">
        {Object.keys(columnsMap).map((tab) => (
          <li
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer mr-4 px-4 py-2 ${
              activeTab === tab ? "border-b-2 border-black" : ""
            }`}
          >
            {tab}
          </li>
        ))}
      </ul>
      <div>{renderTable()}</div>
    </div>
  );
};
