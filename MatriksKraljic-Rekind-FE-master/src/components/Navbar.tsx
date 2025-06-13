import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className=" bg-primary w-full h-16 flex items-center px-4 fixed top-0 left-0 z-50">
      <div className="flex items-center">
        <Image
          src="/master-logo.svg"
          width={30}
          height={30}
          alt="MASTER v2 Logo"
        />
        <div className="ml-2 text-white font-sans font-medium text-2xl">
          MASTER
        </div>
        <div className="ml-2 text-xs text-white font-sans font-semibold relative -top-1">
          V2
        </div>
      </div>
      <Link
        href="/"
        className="ml-28 text-white font-sans font-medium text-lg hover:text-blue-100"
      >
        Home
      </Link>
    </div>
  );
}
