import { storiesOf } from '@storybook/react';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { TextArea } from '../Input';
import { Title } from '../Typography';
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
    isPromoted: {
      type: 'boolean',
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
                default: 'group',
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
  'ui:options': {
    sections: [
      {
        sectionTitle: (
          <Title m={0} level={3}>
            Hey there
          </Title>
        ),
        properties: ['aboutUs', 'isPromoted'],
      },
      {
        sectionTitle: (
          <Title m={0} level={3}>
            This is new
          </Title>
        ),
        properties: ['landing'],
      },
    ],
  },
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
  isPromoted: {
    'ui:help': 'Choose whether to promote it or not',
    'ui:options': {
      label: 'Is promoted?',
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
      'ui:widget': 'tabs',
      'ui:options': {
        itemTitles: ['Hey', <strong>There</strong>],
      },
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

storiesOf('New Form', module)
  .add('basic form', () => (
    <Provider>
      <NewForm schema={schema} uiSchema={uiSchema} getErrorMessage={() => ''} />
    </Provider>
  ))
  .add('custom form', () => {
    const [schema, setSchema] = React.useState(
      `
    {
      type: 'object',
      additionalProperties: false,
      required: [
        'forStore',
        'name',
        'isActive',
        'isPromoted',
        'type',
        'reward',
        'productRules',
      ],
      properties: {
        forStore: {
          type: 'string',
          format: 'uuid',
        },
        name: {
          type: 'string',
          minLength: 2,
          maxLength: 255,
        },
        isActive: {
          type: 'boolean',
          default: false,
        },
        isPromoted: {
          type: 'boolean',
          default: false,
        },
        type: {
          type: 'string',
          enum: ['first', 'second'],
          default: 'first',
        },
        reward: {
          oneOf: [
            {
              title: "First",
              type: 'object',
              additionalProperties: false,
              required: ['type', 'value'],
              properties: {
                type: {
                  type: 'string',
                  const: 'first',
                  default: 'first',
                },
                value: {
                  type: 'number',
                  exclusiveMinimum: 0,
                  exclusiveMaximum: 100,
                },
              },
            },
            {
              type: 'object',
              title: "Second",
              additionalProperties: false,
              required: ['type', 'value'],
              properties: {
                type: {
                  type: 'string',
                  const: 'second',
                  default: 'second',
                },
                value: {
                  type: 'number',
                  exclusiveMinimum: 0,
                },
              },
            },
          ],
        },
      },
    }
    `
    );
    const [uiSchema, setUiSchema] = React.useState(`
    {
      'ui:order': [
        'name',
        'reward',
        'productRules',
        'isActive',
        'isPromoted',
        '*',
      ],
      forStore: {
        'ui:widget': 'hidden',
      },
      type: {
        'ui:widget': 'hidden',
      },
      name: {
        'ui:options': {
          suffix: '.com',
          prefix: 'https://'
        }
      },
      isActive: {},
      isPromoted: {
      },
      reward: {
        'ui:title': "Reward",
        'ui:options': {
          asOneOf: true,
        },
        type: {
          'ui:widget': 'hidden',
        },
        value: {
          'ui:options': {
            mt: 2,
            suffix: 'EUR',
            prefix: '%'
          },
          'ui:title': "Value",
        },
      },
      productRules: {
        'ui:title': "RuleTitle",
        items: {
          type: {
            'ui:widget': 'hidden',
          },
          value: {
            'ui:title': "Value"
          },
        },
      },
    }
    `);
    const [data, setData] = React.useState();

    let parsedSchema = {};
    let parsedUiSchema = {};
    try {
      parsedSchema = eval(`(${schema})`);
      parsedUiSchema = eval(`(${uiSchema})`);
    } catch (e) {
      console.log(e);
    }

    return (
      <Provider>
        <>
          <Flex mb={4} flexDirection="row">
            <Box mr={3} flex={1}>
              <p>Schema</p>
              <TextArea
                rows={12}
                onChange={e => setSchema(e.target.value)}
                value={schema}
              />
            </Box>
            <Box ml={3} flex={1}>
              <p>UI Schema</p>
              <TextArea
                rows={12}
                onChange={e => setUiSchema(e.target.value)}
                value={uiSchema}
              />
            </Box>
            <Box ml={3} flex={1}>
              <p>Data</p>
              <TextArea rows={12} value={JSON.stringify(data ?? {}, null, 2)} />
            </Box>
          </Flex>
          <NewForm
            imageUpload={{
              getImageUrl: () => 'hey',
              uploadImage: () => Promise.resolve(),
              removeImage: () => Promise.resolve(),
            }}
            schema={parsedSchema}
            uiSchema={parsedUiSchema}
            formData={data}
            onChange={({ formData }) => setData(formData)}
            getErrorMessage={() => ''}
          />
        </>
      </Provider>
    );
  });
