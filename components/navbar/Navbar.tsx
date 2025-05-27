import { ReactNode } from "react";

export type NavbarProps = {
  children: ReactNode;
};

function Navbar({ children, ...props }: NavbarProps) {
  return (
    <nav
      {...props}
      className="flex flex-row justify-center text-mc-text min-h-16 w-full font-bold transition-colors duration-500 overflow-x-auto"
    >
      {children}
    </nav>
  );
}

export default Navbar;
