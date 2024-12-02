import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
}

export function Logo({ width = 150, height = 150 }: LogoProps) {
  return (
    <Link href="/" className="-m-1.5 p-1.5">
      <span className="sr-only">Rush Ready</span>
      <Image
        priority
        width={width}
        height={height}
        src="/rush_ready_logo.png"
        alt="Rush Ready Logo"
      />
    </Link>
  );
}
