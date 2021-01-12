// Copied over from https://github.com/rjsf-team/react-jsonschema-form/blob/master/packages/core/src/components/fields/ObjectField.js on 11 January 2021, with modification around the file widget
import React, { Component } from 'react';
import {
  // @ts-ignore
  ADDITIONAL_PROPERTY_FLAG,
  getDefaultRegistry,
  orderProperties,
  retrieveSchema,
  // @ts-ignore
} from '@rjsf/core/dist/cjs/utils';

export default class ObjectField extends Component<any> {
  static defaultProps = {
    uiSchema: {},
    formData: {},
    errorSchema: {},
    idSchema: {},
    required: false,
    disabled: false,
    readonly: false,
  };

  state = {
    wasPropertyKeyModified: false,
    additionalProperties: {},
  };

  isRequired(name: string) {
    const schema = this.props.schema;
    return (
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
    );
  }

  onPropertyChange = (name: string, addedByAdditionalProperties = false) => {
    return (value: any, errorSchema: any) => {
      if (!value && addedByAdditionalProperties) {
        // Don't set value = undefined for fields added by
        // additionalProperties. Doing so removes them from the
        // formData, which causes them to completely disappear
        // (including the input field for the property name). Unlike
        // fields which are "mandated" by the schema, these fields can
        // be set to undefined by clicking a "delete field" button, so
        // set empty values to the empty string.
        value = '';
      }
      const newFormData = { ...this.props.formData, [name]: value };
      this.props.onChange(
        newFormData,
        errorSchema &&
          this.props.errorSchema && {
            ...this.props.errorSchema,
            [name]: errorSchema,
          }
      );
    };
  };

  onObjectChange = (value: any, errorSchema: any) => {
    this.props.onChange(
      value,
      errorSchema &&
        this.props.errorSchema && {
          ...this.props.errorSchema,
          ...errorSchema,
        }
    );
  };

  onDropPropertyClick = (key: any) => {
    return (event: any) => {
      event.preventDefault();
      const { onChange, formData } = this.props;
      const copiedFormData = { ...formData };
      delete copiedFormData[key];
      onChange(copiedFormData);
    };
  };

  getAvailableKey = (preferredKey: any, formData: any) => {
    var index = 0;
    var newKey = preferredKey;
    while (formData.hasOwnProperty(newKey)) {
      newKey = `${preferredKey}-${++index}`;
    }
    return newKey;
  };

  onKeyChange = (oldValue: any) => {
    return (value: any, errorSchema: any) => {
      if (oldValue === value) {
        return;
      }

      value = this.getAvailableKey(value, this.props.formData);
      const newFormData = { ...this.props.formData };
      const newKeys = { [oldValue]: value };
      const keyValues = Object.keys(newFormData).map(key => {
        const newKey = newKeys[key as any] || key;
        return { [newKey]: newFormData[key] };
      });
      const renamedObj = Object.assign({}, ...keyValues);

      this.setState({ wasPropertyKeyModified: true });

      this.props.onChange(
        renamedObj,
        errorSchema &&
          this.props.errorSchema && {
            ...this.props.errorSchema,
            [value]: errorSchema,
          }
      );
    };
  };

  getDefaultValue(type: any) {
    switch (type) {
      case 'string':
        return 'New Value';
      case 'array':
        return [];
      case 'boolean':
        return false;
      case 'null':
        return null;
      case 'number':
        return 0;
      case 'object':
        return {};
      default:
        // We don't have a datatype for some reason (perhaps additionalProperties was true)
        return 'New Value';
    }
  }

  handleAddClick = (schema: any) => () => {
    let type = schema.additionalProperties.type;
    const newFormData = { ...this.props.formData };

    if (schema.additionalProperties.hasOwnProperty('$ref')) {
      const { registry = getDefaultRegistry() } = this.props;
      const refSchema = retrieveSchema(
        { $ref: schema.additionalProperties['$ref'] },
        registry.rootSchema,
        this.props.formData
      );

      type = refSchema.type;
    }

    newFormData[
      this.getAvailableKey('newKey', newFormData)
    ] = this.getDefaultValue(type);

    this.props.onChange(newFormData);
  };

  render() {
    const {
      uiSchema,
      formData,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      idPrefix,
      onBlur,
      onFocus,
      registry = getDefaultRegistry(),
    } = this.props;

    const { rootSchema, fields, formContext, widgets } = registry;
    const { SchemaField, TitleField, DescriptionField } = fields;
    const { FileWidget } = widgets;
    const schema = retrieveSchema(this.props.schema, rootSchema, formData);

    const title = schema.title === undefined ? name : schema.title;
    const description = uiSchema['ui:description'] || schema.description;

    let content;
    // We want the file widget to handle the entire object for a file/media
    if (uiSchema['ui:widget'] === 'file') {
      content = (
        <FileWidget
          multiple={false}
          onChange={this.onObjectChange}
          value={formData}
          options={uiSchema['ui:options'] ?? {}}
        />
      );
    } else {
      let orderedProperties;
      try {
        const properties = Object.keys(schema.properties || {});
        orderedProperties = orderProperties(properties, uiSchema['ui:order']);
      } catch (err) {
        return (
          <div>
            <p className="config-error" style={{ color: 'red' }}>
              Invalid {name || 'root'} object field configuration:
              <em>{err.message}</em>.
            </p>
            <pre>{JSON.stringify(schema)}</pre>
          </div>
        );
      }

      content = orderedProperties.map((name: string) => {
        const addedByAdditionalProperties = schema.properties[
          name
        ].hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);
        return {
          content: (
            <SchemaField
              key={name}
              name={name}
              required={this.isRequired(name)}
              schema={schema.properties[name]}
              uiSchema={
                addedByAdditionalProperties
                  ? uiSchema.additionalProperties
                  : uiSchema[name]
              }
              errorSchema={errorSchema[name]}
              idSchema={idSchema[name]}
              idPrefix={idPrefix}
              formData={(formData || {})[name]}
              wasPropertyKeyModified={this.state.wasPropertyKeyModified}
              onKeyChange={this.onKeyChange(name)}
              onChange={this.onPropertyChange(
                name,
                addedByAdditionalProperties
              )}
              onBlur={onBlur}
              onFocus={onFocus}
              registry={registry}
              disabled={disabled}
              readonly={readonly}
              onDropPropertyClick={this.onDropPropertyClick}
            />
          ),
          name,
          readonly,
          disabled,
          required,
        };
      });
    }

    const Template =
      uiSchema['ui:ObjectFieldTemplate'] || registry.ObjectFieldTemplate;

    const templateProps = {
      title: uiSchema['ui:title'] || title,
      description,
      TitleField,
      DescriptionField,
      properties: content,
      readonly,
      disabled,
      required,
      idSchema,
      uiSchema,
      schema,
      formData,
      formContext,
    };
    return <Template {...templateProps} onAddClick={this.handleAddClick} />;
  }
}
