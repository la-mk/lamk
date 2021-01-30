import { storiesOf } from '@storybook/react';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Textarea } from '../Textarea';
import { Heading } from '../Heading';
import * as React from 'react';
import { Provider } from '../Provider';
import { NewForm } from './NewForm';
import extraWidgets from './widgets/extra';

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
      type: ['object', 'null'],
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
    company: {
      // @ts-ignore the typings are wrong
      type: ['object', 'null'],
      additionalProperties: false,
      required: [
        'companyName',
        'companyAddress',
        'registryNumber',
        'taxNumber',
      ],
      properties: {
        companyName: {
          type: 'string',
          minLength: 2,
          maxLength: 511,
        },
        companyAddress: {
          type: 'string',
          minLength: 2,
          maxLength: 1023,
        },
        registryNumber: {
          type: 'string',
          minLength: 2,
          maxLength: 127,
        },
        taxNumber: {
          type: 'string',
          minLength: 2,
          maxLength: 127,
        },
      },
    },
    isPromoted: {
      type: 'boolean',
    },
    groups: {
      type: 'array',
      maxItems: 10,
      uniqueItems: true,
      items: {
        type: 'string',
        minLength: 2,
        maxLength: 127,
      },
    },
    files: {
      type: 'array',
      items: {
        type: 'object',
        required: [],
        properties: {
          _id: {
            type: 'string',
          },
          height: {
            type: 'number',
            exclusiveMinimum: 0,
          },
          width: {
            type: 'number',
            exclusiveMinimum: 0,
          },
          // In kb
          size: {
            type: 'number',
            exclusiveMinimum: 0,
          },
          mimeType: {
            type: 'string',
            enum: ['image/jpeg', 'image/png'],
          },
        },
      },
    },
    file: {
      type: ['object', 'null'],
      required: [],
      properties: {
        _id: {
          type: 'string',
        },
        height: {
          type: 'number',
          exclusiveMinimum: 0,
        },
        width: {
          type: 'number',
          exclusiveMinimum: 0,
        },
        // In kb
        size: {
          type: 'number',
          exclusiveMinimum: 0,
        },
        mimeType: {
          type: 'string',
          enum: ['image/jpeg', 'image/png'],
        },
      },
    },
    category: {
      type: 'string',
    },
    total: {
      type: 'number',
    },
    landing: {
      nullable: true,
      type: ['object', 'null'],
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
    productRules: {
      type: 'array',
      minItems: 1,
      maxItems: 1,
      items: {
        oneOf: [
          {
            title: 'All',
            type: 'object',
            additionalProperties: false,
            required: ['type', 'value'],
            properties: {
              type: {
                type: 'string',
                const: 'all',
                default: 'all',
              },
              value: {
                type: 'string',
                enum: ['all'],
                default: 'all',
              },
            },
          },
          {
            title: 'Group',
            type: 'object',
            additionalProperties: false,
            required: ['type', 'value'],
            properties: {
              type: {
                type: 'string',
                const: 'group',
                default: 'group',
              },
              value: {
                type: 'string',
                minLength: 2,
                maxLength: 127,
              },
            },
          },
        ],
      },
    },
  },
};

const uiSchema = {
  'ui:options': {
    sections: [
      {
        sectionTitle: (
          <Heading m={0} as={'h2'}>
            Hey there
          </Heading>
        ),
        properties: ['aboutUs', 'company', 'isPromoted', 'files', 'file'],
      },
      {
        sectionTitle: (
          <Heading m={0} as={'h2'}>
            This is new
          </Heading>
        ),
        properties: ['groups', 'category', 'total', 'landing', 'productRules'],
      },
    ],
  },
  aboutUs: {
    description: {
      'ui:title': 'About you',
      'ui:description': 'Tell us more about yourself',
      'ui:widget': 'richText',
      'ui:options': {
        height: '20rem',
      },
    },
  },
  isPromoted: {
    'ui:help': 'Choose whether to promote it or not',
    'ui:options': {
      label: 'Is promoted?',
    },
  },
  groups: {
    'ui:widget': 'select',
    'ui:options': {
      minWidth: '200px',
      flex: 1,
      mode: 'tags',
      loading: true,
      customEnumOptions: [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
        {
          label: '3',
          value: '3',
        },
      ],
    },
  },
  files: {
    'ui:widget': 'files',
  },
  file: {
    'ui:widget': 'file',
  },
  category: {
    'ui:widget': 'cascader',
    'ui:options': {
      minWidth: '200px',
      flex: 1,
      cascadeOptions: [
        {
          title: 'a',
          key: 'a',
          children: [
            {
              title: 'b',
              key: 'b',
              children: [
                { title: 'c', key: 'c', children: undefined },
                { title: 'd', key: 'd', children: undefined },
              ],
            },
          ],
        },
      ],
      customValue: ['a', 'b', 'c'],
    },
  },
  total: {
    'ui:options': {
      numberInputModes: [
        {
          id: 'value',
          previewSuffix: '%',
          suffix: 'EUR',
          baseConverter: (val: number) => val,
          inputConverter: (val: number) => val,
          previewConverter: (val: number) => 1000 - (val ?? 0),
          min: 0,
          max: 1000,
        },
        {
          id: 'percentage',
          previewSuffix: 'EUR',
          suffix: '%',
          baseConverter: (percentage: number) => percentage * 100,
          inputConverter: (val: number) => val / 100,
          previewConverter: (val: number) => val ?? 0,
          min: 0,
          max: 100,
        },
      ],
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
  productRules: {
    'ui:title': 'Type',
    items: {
      'ui:options': {
        asOneOf: true,
      },
      type: {
        'ui:widget': 'hidden',
      },
      value: {
        'ui:title': 'Target',
        'ui:widget': 'select',
        'ui:options': {
          mt: 2,
        },
      },
    },
  },
};

storiesOf('New Form', module)
  .add('basic form', () => {
    const [formData, setFormData] = React.useState({ groups: ['gro'] });

    return (
      <Provider>
        <NewForm
          extraWidgets={extraWidgets}
          imageUpload={{
            getImageUrl: id => id,
            uploadImage: () => {
              return new Promise(resolve => {
                setTimeout(
                  () =>
                    resolve({
                      id: `https://picsum.photos/200/${Math.round(
                        (Math.random() + 20) * 20
                      )}`,
                    }),
                  3000
                );
              });
            },
            removeImage: () => Promise.resolve(),
          }}
          formData={formData}
          schema={schema}
          uiSchema={uiSchema}
          onChange={({ formData }) => setFormData(formData)}
          getErrorMessage={() => ''}
        />
      </Provider>
    );
  })
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
          <Flex mb={4} direction="row">
            <Box mr={3} flex={1}>
              <p>Schema</p>
              <Textarea
                rows={12}
                onChange={e => setSchema(e.target.value)}
                value={schema}
              />
            </Box>
            <Box ml={3} flex={1}>
              <p>UI Schema</p>
              <Textarea
                rows={12}
                onChange={e => setUiSchema(e.target.value)}
                value={uiSchema}
              />
            </Box>
            <Box ml={3} flex={1}>
              <p>Data</p>
              <Textarea rows={12} value={JSON.stringify(data ?? {}, null, 2)} />
            </Box>
          </Flex>
          <NewForm
            imageUpload={{
              getImageUrl: () => 'hey',
              uploadImage: () => Promise.resolve() as any,
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
