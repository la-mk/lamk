import styled from "@emotion/styled";
import { Box } from "@la-mk/blocks-ui";

export const ImageBackgroundBox = styled(Box)<{ url: string }>`
  position: relative;
  overflow: hidden;
  background: ${(props) => (props.theme as any).colors.background.light};
  background-image: url(${(props) => props.url});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
`;
