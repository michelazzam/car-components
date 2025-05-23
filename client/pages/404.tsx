import { useRouter } from "next/router";

function Custom404() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src="/404.svg" alt="404" className="w-1/2 h-1/2" />

      <p className="text-2xl mt-4 text-bold ">Page Not Found</p>
      <button
        onClick={() => router.back()}
        className="ti ti-btn ti-btn-primary mt-6 !px-10 py-4 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Return Back
      </button>
    </div>
  );
}
Custom404.layout = "ContentLayout";
export default Custom404;
