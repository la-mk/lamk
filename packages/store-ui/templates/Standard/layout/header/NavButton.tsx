import { Button, ButtonProps, Text } from "@la-mk/blocks-ui";
import React from "react";

export interface NavButtonProps extends ButtonProps {
  title: string;
  icon: React.ReactNode;
  hideTitle?: boolean;
}

export const NavButton = React.forwardRef(
  ({ title, icon, hideTitle, ...props }: NavButtonProps, ref) => {
    return (
      <Button
        ref={ref}
        mx={2}
        as={props.href ? "a" : undefined}
        variant="link"
        aria-label={title}
        leftIcon={
          <Text
            lineHeight={0}
            size={props.variant === "solid" ? "md" : "2xl"}
            color={props.variant === "solid" ? "text.light" : "text.dark"}
          >
            {icon}
          </Text>
        }
        {...props}
      >
        {!hideTitle && (
          <Text display={["none", "none", "initial"]}>{title}</Text>
        )}
      </Button>
    );
  }
);

NavButton.displayName = "NavButton";
