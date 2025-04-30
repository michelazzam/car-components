export default function TableStyle({ children }: { children: any }) {
  return (
    <div className="mb-2  flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden border border-gray-200 rounded">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
