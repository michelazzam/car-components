import { cn } from "@/utils/cn";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";

export default function BackBtn({
  href,
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  const router = useRouter();

  const goBack = () => router.back();

  if (href) {
    return (
      <Link
        href={href}
        className={cn("hover:translate-x-2 transition-all", className)}
      >
        <BsArrowLeft size={25} />
      </Link>
    );
  }
  return (
    <button onClick={goBack} className={cn(className)}>
      <BsArrowLeft size={25} />
    </button>
  );
}
