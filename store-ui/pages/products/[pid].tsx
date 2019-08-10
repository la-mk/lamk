import styled from 'styled-components';
import { useRouter } from 'next/router';

const Title = styled.h1`
  color: red;
`;

export default () => {
  const router = useRouter();
  const { pid } = router.query;

  return <Title>Hi {pid}</Title>
};
