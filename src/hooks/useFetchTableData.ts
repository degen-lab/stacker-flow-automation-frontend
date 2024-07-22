import { useState, useEffect } from "react";
import axios from "axios";
import { RowData } from "@/types/tableTypes";

export const useFetchTableDataWithInterval = (
  url: string,
  interval: number
) => {
  const [data, setData] = useState<Record<string, RowData[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

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
        if (isMounted) {
          setData(transformedData);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error : new Error(String(error)));
          setLoading(false);
        }
      }
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, interval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [url, interval]);

  return { data, loading, error };
};
