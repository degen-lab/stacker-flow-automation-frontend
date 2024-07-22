import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import { TableComponent } from "../Table/TableComponent";
import { columnsMap } from "../Table/ColumnDefinitions";
import { CustomColumnDef, RowData } from "@/types/tableTypes";
import {
  OnChangeFn,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { SERVER_URL } from "@/constants/urls";

export const Landing: React.FC = () => {
  const [activeTab, setActiveTab] = useState("acceptedDelegations");
  const [columnVisibilityMap, setColumnVisibilityMap] = useState<
    Record<string, VisibilityState>
  >({});
  const [filterStates, setFilterStates] = useState<
    Record<string, ColumnFiltersState>
  >({});
  const [sortStates, setSortStates] = useState<Record<string, SortingState>>(
    {}
  );
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  const { data, loading, error } = useFetchTableData(SERVER_URL);

  const currentColumns = useMemo(() => columnsMap[activeTab], [activeTab]);
  const currentData = useMemo(() => data?.[activeTab] ?? [], [data, activeTab]);

  // Initialize states for all tabs
  useEffect(() => {
    interface InitialState {
      visibility: VisibilityState;
      filters: ColumnFiltersState;
      sorting: SortingState;
    }

    const initialStates: Record<string, InitialState> = {};
    Object.keys(columnsMap).forEach((tab) => {
      initialStates[tab] = {
        visibility: {},
        filters: [],
        sorting: [],
      };
      columnsMap[tab].forEach((column) => {
        initialStates[tab].visibility[column.accessorKey as string] = true;
      });
    });
    setColumnVisibilityMap(
      Object.fromEntries(
        Object.entries(initialStates).map(([key, value]) => [
          key,
          value.visibility,
        ])
      )
    );
    setFilterStates(
      Object.fromEntries(
        Object.entries(initialStates).map(([key, value]) => [
          key,
          value.filters,
        ])
      )
    );
    setSortStates(
      Object.fromEntries(
        Object.entries(initialStates).map(([key, value]) => [
          key,
          value.sorting,
        ])
      )
    );
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = useCallback(
    (updater) => {
      setColumnVisibilityMap((prev) => ({
        ...prev,
        [activeTab]:
          typeof updater === "function" ? updater(prev[activeTab]) : updater,
      }));
    },
    [activeTab]
  );

  const handleFilterChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      setFilterStates((prev) => ({
        ...prev,
        [activeTab]:
          typeof updater === "function" ? updater(prev[activeTab]) : updater,
      }));
    },
    [activeTab]
  );

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      setSortStates((prev) => ({
        ...prev,
        [activeTab]:
          typeof updater === "function" ? updater(prev[activeTab]) : updater,
      }));
    },
    [activeTab]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowColumnToggle(!showColumnToggle)}
          className="bg-orange-500 text-white px-4 py-2 rounded-md"
        >
          {showColumnToggle ? "Hide" : "Show"} Column Visibility Settings
        </button>
        {showColumnToggle && (
          <div className="flex overflow-x-auto space-x-4">
            {currentColumns.map((column: CustomColumnDef<RowData>) => (
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
                  onChange={() =>
                    handleColumnVisibilityChange((prev) => ({
                      ...prev,
                      [column.accessorKey as string]:
                        !prev[column.accessorKey as string],
                    }))
                  }
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
            onClick={() => handleTabChange(tab)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleTabChange(tab);
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
      <div className="flex-1 overflow-y-auto pb-12">
        <TableComponent
          columns={currentColumns}
          data={currentData}
          columnVisibility={columnVisibilityMap[activeTab] || {}}
          setColumnVisibility={handleColumnVisibilityChange}
          filters={filterStates[activeTab] || []}
          onFiltersChange={handleFilterChange}
          sorting={sortStates[activeTab] || []}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  );
};

export default Landing;
