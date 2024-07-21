"use client";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import { Link } from "@nextui-org/react";
import Image from "next/image";
// import { useContext, useState } from "react";
// import { AuthContext } from "@/app/contexts/AuthContext";

export interface NavbarItem {
  name: string;
  location: string;
  color?:
    | "foreground"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export const NavbarSoloStacking = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <Navbar className="p-0 m-0">
      <div className="flex w-full justify-between items-center">
        <NavbarContent>
          <Link color="foreground" href="/">
            <Image
              src="/stacks-logo.png"
              alt="Automation of Stacker Delegation"
              priority
              width={30}
              height={30}
            />
          </Link>
        </NavbarContent>
        <NavbarContent className="flex justify-center">
          <NavbarBrand>
            <Link color="foreground" href="/">
              <p className="text-xl font-extrabold text-inherit">
                Automation of Stacker Delegation
              </p>
            </Link>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent>
          <Link color="foreground" href="/">
            <Image
              src="/stacks-logo.png"
              alt="Automation of Stacker Delegation"
              priority
              width={30}
              height={30}
            />
          </Link>
        </NavbarContent>
      </div>
    </Navbar>
  );
};
