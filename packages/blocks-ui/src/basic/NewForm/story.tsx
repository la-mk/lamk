import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '../Provider';
import { NewForm } from './NewForm';

export const schema: any = {
  type: 'object',
  additionalProperties: false,
  required: ['forStore'],
  properties: {
    forStore: {
      type: 'string',
      format: 'uuid',
    },
    aboutUs: {
      nullable: true,
      type: 'object',
      additionalProperties: false,
      required: [],
      properties: {
        description: {
          nullable: true,
          type: 'string',
          minLength: 2,
          maxLength: 65535,
        },
      },
    },
    landing: {
      nullable: true,
      type: 'object',
      additionalProperties: false,
      required: ['sets'],
      properties: {
        banner: {
          nullable: true,
          type: 'string',
          minLength: 2,
          maxLength: 4095,
        },
        color: {
          type: 'string',
          format: 'hexColor',
        },
        sets: {
          type: 'array',
          maxItems: 12,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'type', 'value', 'isPromoted'],
            properties: {
              title: {
                type: 'string',
                minLength: 2,
                maxLength: 511,
              },
              subtitle: {
                nullable: true,
                type: 'string',
                minLength: 2,
                maxLength: 511,
              },
              type: {
                type: 'string',
                enum: ['group', 'category'],
                minLength: 2,
                maxLength: 127,
              },
              value: {
                type: 'string',
                minLength: 2,
                maxLength: 255,
              },
              isPromoted: {
                type: 'boolean',
              },
            },
          },
        },

        hideSlogan: {
          nullable: true,
          type: 'boolean',
        },
      },
    },
  },
};

const uiSchema = {
  aboutUs: {
    description: {
      'ui:title': 'About you',
      'ui:description': 'Tell us more about yourself',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 4,
      },
    },
  },
  landing: {
    banner: {
      'ui:title': 'Banner',
    },
    color: {
      'ui:widget': 'color',
    },
    sets: {
      'ui:title': 'Product sets',
      'ui:description': 'The sets that should be shown in the home page',
      items: {
        title: {
          'ui:title': 'Set title',
        },
        type: {
          'ui:widget': 'select',
          'ui:options': {
            customEnumOptions: [
              { value: 'group', label: 'Group' },
              { value: 'category', label: 'Category' },
            ],
          },
        },
      },
    },
  },
};

storiesOf('New Form', module).add('basic form', () => (
  <Provider>
    <NewForm schema={schema} uiSchema={uiSchema} getErrorMessage={() => ''} />
  </Provider>
));
