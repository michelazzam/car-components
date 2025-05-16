import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";

export default function BackBtn() {
  const router = useRouter();

  const goBack = () => router.back();

  return (
    <button onClick={goBack}>
      <BsArrowLeft size={25} />
    </button>
  );
}
