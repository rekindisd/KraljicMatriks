"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function Sidebar() {
  const { projectid } = useParams();

  return (
    <div className="bg-[#d8d8d8] w-[272px] min-h-screen flex flex-col items-start fixed top-16 left-0">
      <ul className="list-none pl-0 w-full">
        <li className="text-sm text-black font-semibold bg-[#f4f4f4] w-full p-2 shadow">
          Matrix Kraljic
        </li>
        <Link href={`/${projectid}`}>
          <li className="text-sm pl-4 text-black hover:text-blue-300 cursor-pointer bg-[#f4f4f4] text-left w-full p-2 font-medium mt-[1px] shadow">
            List Task
          </li>
        </Link>
      </ul>
    </div>
  );
}
