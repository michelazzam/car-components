import { Table, flexRender } from "@tanstack/react-table";
import { cn } from "@/utils/cn";

interface ColumnMeta {
  sticky?: "left" | "right";
  stickyClassName?: string;
}

export default function TableBody<DataType>({
  table,
}: {
  table: Table<DataType>;
}) {
  return (
    <tbody className="bg-white">
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id} className="border-b even:bg-gray-50">
          {row.getVisibleCells().map((cell) => {
            const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
            const sticky = meta?.sticky;
            const stickyClassName = meta?.stickyClassName;
            return (
              <td
                key={cell.id}
                className={`whitespace-nowrap p-2 text-start text-sm font-medium text-gray-900 ${
                  sticky ? stickyClassName : ""
                }`}
                style={{
                  position: sticky ? "sticky" : undefined,
                  [sticky as string]: sticky ? 0 : undefined,
                  zIndex: sticky ? 1 : undefined,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
