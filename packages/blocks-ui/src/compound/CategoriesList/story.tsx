import range from 'lodash/range';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { CategoriesList } from './';
import { Provider } from '../../';
import random from 'lodash/random';
import { Flex } from '../../basic/Flex';
import { Overlay } from '../Overlay';

const generateContent = (key: string) =>
  range(0, 8).map(i => ({
    title: `${key} item`,
    key: `${key}${i}`,

    children: range(0, random(6, 10)).map(j => ({
      title: `Nested ${key} item`,
      key: `nested${key}${j}`,
    })),
  }));

storiesOf('CategoriesList', module).add('standard', () => {
  const [content, setContent] = React.useState<any>(generateContent('first'));

  return (
    <Provider>
      <div>
        <Flex
          width="100%"
          bg="background.light"
          direction="row"
          align="center"
          justify="flex-start"
          px={[3, 4, 5]}
          // @ts-ignore
          style={{ overflowX: 'auto' }}
        >
          <Overlay
            trigger={({ toggle, close, open }) => {
              return (
                <div>
                  <button
                    onClick={() => {
                      setContent(generateContent('first'));
                      toggle();
                    }}
                    onMouseEnter={() => {
                      setContent(generateContent('first'));
                      open();
                    }}
                    onMouseLeave={() => {
                      close();
                    }}
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => {
                      setContent(generateContent('second'));
                      toggle();
                    }}
                    onMouseEnter={() => {
                      setContent(generateContent('second'));
                      open();
                    }}
                    onMouseLeave={() => {
                      close();
                    }}
                  >
                    Toggle
                  </button>
                </div>
              );
            }}
          >
            <CategoriesList getHref={() => ''} items={content} />
          </Overlay>
        </Flex>
      </div>
    </Provider>
  );
});
