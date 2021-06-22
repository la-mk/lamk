import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Upload } from './';
import { Provider } from '../../';

storiesOf('Upload', module).add('standard', () => {
  const [images, setImages] = React.useState<any>([
    { _id: 'https://picsum.photos/200/300' },
  ]);

  console.log(images);
  return (
    <Provider>
      <div>
        <Upload
          remove={() => {
            return Promise.resolve();
          }}
          upload={() => {
            return new Promise(resolve => {
              setTimeout(
                () =>
                  resolve({
                    id: `https://picsum.photos/200/${Math.round(
                      (Math.random() + 20) * 20
                    )}`,
                  }),
                5000
              );
            });
          }}
          onChange={setImages}
          name="uploader"
          getImageUrl={x => x}
          multiple
          value={images}
        />
      </div>
    </Provider>
  );
});
