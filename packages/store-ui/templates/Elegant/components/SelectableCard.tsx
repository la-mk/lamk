import React from "react";
import { Box, Card, CardProps, Flex, Heading } from "@la-mk/blocks-ui";
import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { BlocksTheme } from "@la-mk/blocks-ui/dist/theme";

interface SelectableCardProps extends CardProps {
  onClick: () => void;
  isChecked: boolean;
  title?: string;
  theme: any;
}

const StyledCard = styled(Card)<{ isChecked: boolean }>`
  border: 1px solid
    ${(props: { isChecked: boolean; theme: BlocksTheme }) =>
      props.isChecked
        ? props.theme.colors?.primary?.["500"]
        : props.theme.colors?.gray?.["100"]};
  transition: border 0.4s ease-out;
  box-sizing: border-box;
  cursor: pointer;
`;

export const SelectableCard = withTheme(
  ({ title, isChecked, children, theme, ...props }: SelectableCardProps) => {
    return (
      <StyledCard isChecked={isChecked} {...props}>
        {title && (
          <Flex
            my={[1, 2, 2]}
            mb={[2, 3, 4]}
            px={[0, 3, 4]}
            align="center"
            justify="space-between"
          >
            <>
              <Heading size="md" color="mutedText.dark" as="h3">
                {title}
              </Heading>
            </>
          </Flex>
        )}

        <Box px={[0, 3, 4]}>{children}</Box>
      </StyledCard>
    );
  }
);
