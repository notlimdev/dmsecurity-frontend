"use client";

import { useAuth } from "@/store/auth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-3 border-b">
      <h2 className="text-lg font-semibold text-gray-700">Panel de Control</h2>
      {user && (
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.username}</span>
          <span className="text-xs text-gray-500">{user.role_display}</span>
        </div>
      )}
    </header>
  );
}
