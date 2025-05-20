import Link from "next/link";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";

export default function BackBtn({ href }: { href?: string }) {
  const router = useRouter();

  const goBack = () => router.back();

  if (href) {
    return (
      <Link href={href} className="hover:translate-x-2 transition-all">
        <BsArrowLeft size={25} />
      </Link>
    );
  }
  return (
    <button onClick={goBack}>
      <BsArrowLeft size={25} />
    </button>
  );
}
