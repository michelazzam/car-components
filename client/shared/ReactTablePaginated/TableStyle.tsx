export default function TableStyle({
  children,
  overflowX = "auto",
}: {
  children: React.ReactNode;
  overflowX?: string;
}) {
  return (
    <div className={`overflow-${overflowX} w-full`}>
      <div className="inline-block min-w-full align-middle">{children}</div>
    </div>
  );
}
