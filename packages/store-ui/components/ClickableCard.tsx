import { Card, Flex, Text } from "@la-mk/blocks-ui";
import React from "react";
import { HoverableLink } from "./HoverableLink";

export const ClickableCard = ({
  title,
  icon,
  href,
}: {
  title: string;
  icon?: React.ReactNode;
  href: string;
}) => {
  return (
    <HoverableLink key={href} href={href}>
      <Card
        p={4}
        minWidth={"16rem"}
        textAlign="center"
        bg="background.light"
        // @ts-ignore
        borderColor="background.light"
      >
        <Flex direction="column" align="center" justify="center">
          {icon && (
            <Text size="3xl" color="mutedText.dark">
              {icon}
            </Text>
          )}
          <Text>{title}</Text>
        </Flex>
      </Card>
    </HoverableLink>
  );
};
