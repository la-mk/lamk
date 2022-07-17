import styled from "@emotion/styled";
import { Text } from "@la-mk/blocks-ui";
import React from "react";

const AnimatedBorderLink = styled.a`
  display: inline-block;
  cursor: pointer;

  &:after {
    content: "";
    display: block;
    border-bottom: solid 2px black;
    transform: scaleX(0);  
    transform-origin: 0% 50%;
    transition: transform 350ms ease-in-out;
  }

  &:hover:after {
    transform: scaleX(1); 
    transform-origin: 0% 50%;
`;

export const NavButton = React.forwardRef(
  ({ title, ...props }: { title: string }, ref) => {
    return (
      // @ts-ignore
      <AnimatedBorderLink aria-label={title} {...props}>
        <Text px={1} whiteSpace="nowrap" color="black" size="md">
          {title}
        </Text>
      </AnimatedBorderLink>
    );
  }
);

NavButton.displayName = "NavButton";
