"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaUserCircle } from "react-icons/fa";
import { LogoutButton } from "../auth/logout-button";
import MobileNav from "./MobileNav";
import { Session } from "next-auth";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
// import { useLoggedInStatus } from "@/hooks/login-status";
// import { signOut } from "@/auth";

interface NavbarProps {
  session: Session | null; 
  // 'Session' from your auth library
}

const Navbar = ({ session }: NavbarProps) => {
  const loggedInStatus = !!session;
  const { cartCount } = useCart();

  return (
    <nav className="flex justify-between z-50 w-[100%] gap-5 p-4 shadow-sm sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image src="/img/logo.jpeg" width={40} height={40} alt="ArtLink" />
        <p>
          <span className="font-semibold text-2xl items-center px-2 ">
            ArtLink
          </span>
        </p>
      </Link>
      <div className="flex items-center">
        {/* NavBar all device except mobile */}
        <div className="flex gap-3 items-center max-sm:hidden">
          <div>
            <Link href="/explore">Explore</Link>
          </div>
          <div>
            <Link href="/commissions">Commissions</Link>
          </div>
          <div>
            <Link href="/wishlist">Wishlist</Link>
          </div>
          <div className="relative">
            <Link href="/cart">Cart</Link>
            {cartCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-3 -right-3 h-5 w-5 flex items-center justify-center rounded-full"
              >
                {cartCount}
              </Badge>
            )}
          </div>

          {loggedInStatus ? (
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full ml-2"
                    />
                  ) : (
                    <FaUserCircle className="h-8 w-8 text-gray-500 ml-2" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  className="flex flex-col items-center shadow-xl min-w-24 mr-12"
                >
                  {/* <DropdownMenuLabel>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuLabel> */}
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuItem className="w-full">
                    <Link
                      href="/profile"
                      className=" flex justify-center w-full p-2 shadow-md rounded-md"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="w-full">
                    <LogoutButton className="w-full shadow-md" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="gap-3 flex">
              <Button>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
        {/* MobileNav Here */}
        <div className="hidden max-sm:flex mr-3">
          <MobileNav loggedInStatus={loggedInStatus} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
