import React, { useState } from "react";
import styles from "../styles/SortableTable.module.scss";
import { useRouter } from "next/router";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: any[];
  renderOperation?: (row: any) => React.ReactNode; // 可选的渲染函数
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data, renderOperation }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    const direction = sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleClick = async (id: any) => {
    router.push({
      pathname: '/articles/article-detail',
      query: { id }
    });
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    })
    : data;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.key} onClick={() => handleSort(header.key)}>
              {header.label} {sortKey === header.key ? (sortDirection === "asc" ? "↑" : "↓") : ""}
            </th>
          ))}
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, i) => (
          <tr key={i}>
            {
              headers.map((header) => (
                <td key={header.key}>{row[header.key]}</td>
              ))
            }
            {renderOperation ? renderOperation(row) : (
              <td><button onClick={() => handleClick(row.id)}>Detail</button></td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;
