import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:h-screen md:flex-row md:overflow-hidden">
      <Sidebar />
      <main className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">{children}</main>
    </div>
  );
}