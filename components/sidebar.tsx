"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  AlertTriangle,
  Wrench,
  Activity,
  LogOut,
  ServerCrash,
} from "lucide-react";
import { useAuth } from "@/store/auth";

const menuItems = [
  { name: "Activos", icon: Activity, href: "/dashboard/assets" },
  { name: "Riesgos", icon: AlertTriangle, href: "/dashboard/risk" },
  { name: "Seguridad", icon: Shield, href: "/dashboard/security" },
  { name: "Mitigación", icon: Wrench, href: "/dashboard/mitigation" },
  { name: "Incidentes", icon: ServerCrash, href: "/dashboard/incident" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r shadow-sm h-screen p-4 flex flex-col justify-between">
      <div>
        <Link href={"/dashboard"}>
          <h1 className="text-2xl font-bold mb-6 text-blue-600">DMSecurity</h1>
        </Link>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  active
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-400 text-gray-600"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-red-600 hover:text-red-700 p-2 rounded-lg mt-6 hover:cursor-pointer"
      >
        <LogOut size={18} />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
}
