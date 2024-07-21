import { useState, useEffect } from "react";
import axios from "axios";
import { RowData } from "@/types/tableTypes";

export const useFetchTableData = (url: string) => {
  const [data, setData] = useState<Record<string, RowData[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: { "Content-Type": "application/json" },
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
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
