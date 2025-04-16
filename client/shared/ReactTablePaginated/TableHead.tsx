import { flexRender } from "@tanstack/react-table";

export default function TableHead({ table }: { table: any }) {
  return (
    <thead className="pl-3 hover:bg-gray-100 transition-all duration-200 ease-linear">
      {table.getHeaderGroups().map((headerGroup: any) => {
        return (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: any) => (
              <th
                key={header.id}
                className="capitalize tracking-wider whitespace-nowrap p-2 text-left text-sm text-black border-b"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        );
      })}
    </thead>
  );
}
