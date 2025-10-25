"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const { token, fetchUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token && !localStorage.getItem("access")) {
      router.push("/login");
    } else {
      fetchUser();
    }
  }, [token, router, fetchUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-6 flex-1">{children}</div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
