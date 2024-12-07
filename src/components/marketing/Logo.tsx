import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
}

export function Logo({ width = 100, height = 100 }: LogoProps) {
  return (
    <Link href="/" className="-m-1.5 p-1.5">
      <span className="sr-only">Rush Ready</span>
      <Image
        priority
        width={width}
        height={height}
        style={{
          width: "auto",
          height: "auto",
          maxWidth: width,
          maxHeight: height,
        }}
        src="/credit-cushion-light-logo.png"
        alt="Rush Ready Logo"
      />
    </Link>
  );
}
