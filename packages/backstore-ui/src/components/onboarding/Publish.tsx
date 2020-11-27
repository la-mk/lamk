import * as React from 'react';
import { Flex, Button } from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';
// import {env} from '../../common/env';

// const ShopIframe = styled.iframe`
//   border: 0;
//   padding: 0;
//   margin: 0;
//   margin-top: 80px;
//   height: calc(100vh - 80px);
//   width: 100vw;
// `;

interface PublishProps {
  onDone: (shouldPublish: boolean) => void;
  storeSlug: string;
}

export const Publish = ({ storeSlug, onDone }: PublishProps) => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' align='center'>
      <Flex
        // @ts-ignore
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        height={80}
        direction='row'
        width='100%'
        bg='lightgray'
        justify='center'
        align='center'
      >
        <Button onClick={() => onDone(true)} m={3}>
          {t('actions.publish')}
        </Button>
        <Button onClick={() => onDone(false)} m={3}>
          {t('actions.goToDashboard')}
        </Button>
      </Flex>
      {/* For this to work, we need to authenticate with the backstore token in the store and not server-render it, but we can leave it for later on.
      <ShopIframe
        src={`https://${storeSlug}.${env.HOST}`}
        name='shop-preview'
        // Can hide a spinner after the iframe is loaded
        onLoad={() => null}
      /> */}
    </Flex>
  );
};
