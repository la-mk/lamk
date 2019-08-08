import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Layout } from '../../src/Layout';

const Title = styled.h1`
  color: red;
`;

export default () => {
  const router = useRouter();
  const { pid } = router.query;

  return <Layout><Title>Hi {pid}</Title></Layout>
};
