import Image from "next/image";

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="animate-spin">
        <Image
          src="/rush_ready_logo.png"
          alt="Loading..."
          width={100}
          height={100}
          priority
        />
      </div>
    </div>
  );
}
