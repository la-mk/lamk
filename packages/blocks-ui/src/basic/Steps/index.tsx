import React from 'react';
import { Flex, FlexProps } from '../Flex';
import { Text } from '../Text';
import { Divider } from '../Divider';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Box } from '../Box';

interface StepProps {
  status: 'danger' | 'success' | 'pending';
  title: string;
  description: string;
  key: string;
}

const color: { [key in StepProps['status']]: string } = {
  danger: 'danger',
  success: 'primary.500',
  pending: 'gray.300',
};

const content = {
  danger: <CloseOutlined />,
  success: <CheckOutlined />,
  pending: undefined,
};

const Description = ({ status, description }: Partial<StepProps>) => {
  return (
    <Text
      maxWidth="120px"
      as="p"
      isTruncated
      size="xs"
      color={status === 'pending' ? 'mutedText.dark' : 'text.dark'}
    >
      {description}
    </Text>
  );
};

const Title = React.forwardRef(({ status, title }: Partial<StepProps>, ref) => {
  return (
    <Text
      ref={ref}
      as="div"
      isTruncated
      width="fit-content"
      size="md"
      color={status === 'pending' ? 'mutedText.dark' : 'text.dark'}
    >
      {title}
    </Text>
  );
});

const Circle = ({ status, index }: StepProps & { index: number }) => {
  return (
    <Flex
      align="center"
      justify="center"
      // @ts-ignore
      borderRadius="full"
      borderColor={color[status]}
      borderWidth="1px"
      borderStyle="solid"
      bg={status === 'success' ? color[status] : 'transparent'}
      color={status === 'success' ? 'white' : color[status]}
      minHeight={7}
      minWidth={7}
      maxHeight={7}
      maxWidth={7}
      mr={2}
    >
      {content[status] ?? index + 1}
    </Flex>
  );
};

const Step = ({
  index,
  orientation,
  steps,
  ...step
}: StepProps & {
  index: number;
  steps: StepProps[];
  orientation: 'horizontal' | 'vertical';
}) => {
  const titleRef = React.useRef<HTMLDivElement>();
  const clientWidth = titleRef.current?.clientWidth ?? 0;

  return (
    <Flex
      key={step.key}
      flex={index < steps.length - 1 ? 1 : undefined}
      direction={orientation === 'vertical' ? 'column' : 'row'}
      align="flex-start"
    >
      <Flex mr={orientation === 'vertical' ? 0 : 2}>
        <Circle {...step} index={index} />
        <Box minWidth={'120px'} maxWidth="120px">
          <Title ref={titleRef} {...step} />
          <Description {...step} />
        </Box>
      </Flex>
      {index < steps.length - 1 ? (
        <Box
          width="100%"
          mr={orientation === 'horizontal' ? 2 : undefined}
          ml={
            orientation === 'horizontal'
              ? (clientWidth - 120).toString()
              : undefined
          }
          // @ts-ignore
          position="relative"
        >
          <Divider
            // @ts-ignore
            position={orientation === 'horizontal' ? 'absolute' : undefined}
            top={3}
            left={0}
            right={0}
            // @ts-ignore
            minHeight={orientation === 'vertical' ? 10 : 0}
            // @ts-ignore
            minWidth={orientation === 'vertical' ? 0 : 6}
            // @ts-ignore
            borderColor={color[steps[index + 1].status]}
            my={orientation === 'vertical' ? 2 : 0}
            mt={orientation === 'vertical' ? -2 : 0}
            ml={orientation === 'vertical' ? 3 : 0}
            orientation={orientation}
          />
        </Box>
      ) : null}
    </Flex>
  );
};

export interface StepsProps extends FlexProps {
  steps: Array<StepProps>;
  orientation: 'vertical' | 'horizontal';
  onClick?: (key: string) => void;
}

export const Steps = ({
  steps,
  onClick,
  orientation,
  ...props
}: StepsProps) => {
  return (
    <Flex
      {...props}
      direction={orientation === 'vertical' ? 'column' : 'row'}
      align="flex-start"
      justify="space-between"
    >
      {steps.map((step, idx) => {
        return (
          <Step {...step} index={idx} orientation={orientation} steps={steps} />
        );
      })}
    </Flex>
  );
};
