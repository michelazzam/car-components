import useGetDBBackupPath from "@/api-hooks/db-backup/use-get-DB-backup-path";
import EditBackupPath from "../../components/pages/admin/db-backup/EditBackupPath";

function DbBackupPage() {
  const { data, isLoading } = useGetDBBackupPath();

  return (
    <section className="mb-5">
      <div className="w-full">
        <div className="container mx-auto py-6">
          {!isLoading && <EditBackupPath path={data?.path} />}
        </div>
      </div>
    </section>
  );
}

DbBackupPage.layout = "Contentlayout";
export default DbBackupPage;
