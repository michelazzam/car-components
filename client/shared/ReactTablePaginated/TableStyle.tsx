import { cn } from "@/utils/cn";

export default function TableStyle({
  children,
  overflowX = "overflow-x-auto ",
}: {
  children: any;
  overflowX?: string;
}) {
  return (
    <div className="mb-2  flex flex-col">
      <div className={cn("sm:-mx-6 lg:-mx-8", overflowX)}>
        <div className="inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden border border-gray-200 rounded">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
