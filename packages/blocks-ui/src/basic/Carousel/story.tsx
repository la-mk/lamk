import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Carousel } from './';
import { Provider, Card } from '../../';

const items = [
  {
    id: 1,
    name: 'First entry',
  },
  {
    id: 2,
    name: 'Second entry',
  },
  {
    id: 3,
    name: 'Third entry',
  },
  {
    id: 4,
    name: 'Fourth entry',
  },
  {
    id: 5,
    name: 'Fifth entry',
  },
  {
    id: 6,
    name: 'Sixth entry',
  },
  {
    id: 7,
    name: 'Seventh entry',
  },
];

storiesOf('Carousel', module)
  .add('standard', () => {
    return (
      <Provider>
        <div>
          <Carousel
            navigation="arrows"
            loop
            skipSnaps
            slidesToScroll={'auto'}
            items={items}
            renderItem={(item) => (
              <Card width={300} height={300} mx="2">
                {item.name}
              </Card>
            )}
          ></Carousel>
        </div>
      </Provider>
    );
  })
  .add('fullscreen', () => {
    return (
      <Provider>
        <div>
          <Carousel
            navigation="dots"
            fullscreen
            items={items}
            renderItem={(item) => (
              <Card width="100%" height={300}>
                {item.name}
              </Card>
            )}
          ></Carousel>
        </div>
      </Provider>
    );
  });
