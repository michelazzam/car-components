import { Table, flexRender } from "@tanstack/react-table";

interface ColumnMeta {
  sticky?: "left" | "right";
  stickyClassName?: string;
}

export default function TableHead<DataType>({
  table,
}: {
  table: Table<DataType>;
}) {
  return (
    <thead className="bg-gray-50">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta as ColumnMeta | undefined;
            const sticky = meta?.sticky;
            const stickyClassName = meta?.stickyClassName;
            return (
              <th
                key={header.id}
                className={`whitespace-nowrap p-2 text-start text-sm font-medium text-gray-900 ${
                  sticky ? stickyClassName : ""
                }`}
                style={{
                  position: sticky ? "sticky" : undefined,
                  [sticky as string]: sticky ? 0 : undefined,
                  zIndex: sticky ? 1 : undefined,
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
