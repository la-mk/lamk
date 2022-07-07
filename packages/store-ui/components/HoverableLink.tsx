import React from "react";
import Link, { LinkProps } from "next/link";

export const HoverableLink = ({
  children,
  ...props
}: LinkProps & { children: React.ReactNode }) => {
  return (
    <Link {...props}>
      <a style={{ textDecoration: "none" }}>{children}</a>
    </Link>
  );
};
