import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white font-sans">
      <Sidebar />
      {children}
    </div>
  );
}
