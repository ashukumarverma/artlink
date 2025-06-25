"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuShoppingBag,
  LuPackage,
  LuPaintbrush,
  LuWallet,
  LuSettings,
  LuTrendingUp,
  LuChevronRight,
} from "react-icons/lu";
import { RxAvatar } from "react-icons/rx";
// import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const sidebarLinks = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: LuShoppingBag,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: LuPackage,
  },
  {
    title: "Commissions",
    href: "/dashboard/commissions",
    icon: LuPaintbrush,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: LuWallet,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: LuTrendingUp,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: LuSettings,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: RxAvatar,
  }
];

export function DashboardSidebar() {
  const user = useCurrentUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 mb-4">
        <Image
          src="/img/logo.jpeg"
          alt="ArtLink"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-xl font-bold text-white">ArtLink</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-indigo-500 text-white"
                  : "text-gray-300 hover:text-white hover:bg-indigo-500/50"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.title}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-indigo-900/50 p-4 mt-auto">
        <p className="text-sm text-gray-400">Signed in as</p>
        <p className="text-sm font-medium text-gray-100">{user?.email}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Slide-out Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "md:hidden fixed top-1/2 -translate-y-1/2 z-50 bg-indigo-600 text-white p-2 rounded-r-lg transition-all duration-300",
          isOpen ? "left-[280px]" : "left-0"
        )}
      >
        <LuChevronRight className={cn(
          "h-6 w-6 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 w-[280px] bg-gradient-to-b from-indigo-900 to-indigo-950 text-gray-100 z-50 transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-indigo-900 to-indigo-950 text-gray-100 z-50">
        <SidebarContent />
      </aside>
    </>
  );
} 