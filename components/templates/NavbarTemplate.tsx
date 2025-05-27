import React from "react";
import { Navbar, NavbarElement, NavbarMain } from "@/components/navbar";
import NavbarWallet from "../navbar/NavbarWallet";

const NavbarTemplate = () => {
  return (
    <Navbar>
      <NavbarMain>
        <NavbarElement link={"/"}>
        <img src="/logo-ev.png" alt="logo" className="h-16 w-auto mr-2 object-contain"/>
        </NavbarElement>
        <NavbarElement link={"/login"}>Login</NavbarElement>
        <NavbarElement link={"/register"}>Register</NavbarElement>
        <NavbarWallet />
      </NavbarMain>
    </Navbar>
  );
};

export default NavbarTemplate;
