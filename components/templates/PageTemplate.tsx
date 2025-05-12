"use client";

import Link from "next/link";
import { ReactNode } from "react";

type CleanPageProps = {
  children: ReactNode;
  bgClass?: string;
  allowUnauthenticated?: boolean;
};

const PageTemplate = ({
  children,
  bgClass,
  allowUnauthenticated = false,
}: CleanPageProps) => {
  const baseClasses = `bg-center bg-ev-main-bg bg-fixed bg-cover text-ev-text min-h-screen w-screen font-mono gap-5 flex flex-col items-center h-[100vh] ${bgClass || ""}`;

  return <main className={baseClasses}>{children}</main>;
};

export default PageTemplate;
