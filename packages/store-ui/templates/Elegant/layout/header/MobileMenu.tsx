import styled from "@emotion/styled";
import { Box, Button, Drawer, Text } from "@la-mk/blocks-ui";
import { Menu } from "react-feather";
import React, { useState } from "react";
import { BlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import Link from "next/link";

const AnimatedDrawerContent = styled.div`
  @keyframes drawerShowUp {
    0% {
      transform: translateX(-10%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  animation: 0.8s ease-out 0s 1 drawerShowUp;
`;

const AnimatedBorderLink = styled.a`
  width: 100%;
  display: inline-block;
  cursor: pointer;
`;

const BorderedLinkBox = styled.div`
  border-bottom: ${(props: { theme: BlocksTheme }) =>
    `1px solid ${props.theme.colors?.gray?.["200"]}`};
`;

export const MobileMenu = ({
  menus,
}: {
  menus: { title: string; href: string }[];
}) => {
  const [showSider, setShowSider] = useState(false);

  return (
    <>
      <Button variant="link" onClick={() => setShowSider(true)}>
        <Menu />
      </Button>

      <Drawer
        size="xs"
        isOpen={showSider}
        onClose={() => setShowSider(false)}
        placement="left"
      >
        <AnimatedDrawerContent>
          <Box mt={7}>
            {menus.map((x) => (
              // @ts-ignore
              <BorderedLinkBox key={x.title}>
                <Link href={x.href} passHref>
                  <AnimatedBorderLink
                    title={x.title}
                    onClick={() => setShowSider(false)}
                  >
                    <Text width="100%" display={"inline-block"} py={5}>
                      {x.title}
                    </Text>
                  </AnimatedBorderLink>
                </Link>
              </BorderedLinkBox>
            ))}
          </Box>
        </AnimatedDrawerContent>
      </Drawer>
    </>
  );
};
