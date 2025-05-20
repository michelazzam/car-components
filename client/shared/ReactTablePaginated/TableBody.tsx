import { cn } from "@/utils/cn";
import { flexRender } from "@tanstack/react-table";

export default function TableBody({ table }: { table: any }) {
  return (
    <tbody className="bg-white">
      {table.getRowModel().rows.map((row: any) => (
        <tr
          key={row.id}
          className="border-b hover:bg-gray-100 transition-all duration-200 ease-linear"
        >
          {row.getVisibleCells().map((cell: any) => {
            const cellValue = cell.getValue();
            return (
              <td
                key={cell.id}
                className={cn(
                  "whitespace-nowrap p-2 text-start text-sm font-medium text-gray-900 "
                )}
              >
                {cellValue !== null ? (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                ) : (
                  <span className="text-gray-300"> N/A</span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
