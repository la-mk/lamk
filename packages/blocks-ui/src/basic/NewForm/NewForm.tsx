import React from 'react';
import Form, { FormProps as RjsfFormProps, AjvError } from '@rjsf/core';
import fields from './fields';
import widgets from './widgets';
import templates from './templates';
import { Flex } from '../Flex';
import { FormContext, FormContextProps } from './Context';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';

export interface FormProps<T> extends RjsfFormProps<T>, FormContextProps {
  getErrorMessage: (errorName: string, context: any) => string;
}

// Here, in ObjectFieldTemplate, ArrayFieldTemplate, and FieldTemplate we apply certain margins as a way to provide a gutter to a flex-based grid.
const StyledForm = (styled(Form)`
  margin-left: -1rem;
  margin-right: -1rem;
  overflow: hidden;
` as React.ComponentType) as new <T>() => Form<T>;

const recursivelyNormalizeData = (data: any) => {
  if (!data || !(typeof data === 'object')) {
    return data;
  }

  Object.entries(data).forEach(([key, val]) => {
    if (typeof data[key] === 'object') {
      if (isEmpty(data[key])) {
        data[key] = null;
        return;
      }
      return recursivelyNormalizeData(data[key]);
    }

    if (val === undefined) {
      data[key] = null;
      return;
    }
  });

  return data;
};

export const NewForm = <T extends any>({
  children,
  onSubmit,
  getErrorMessage,
  imageUpload,
  ...props
}: FormProps<T>) => {
  const transformErrors = (errors: AjvError[]) => {
    errors.forEach(error => {
      let errName: string = error.name;
      if (error.name === 'type') {
        errName = error.params.type;
      }

      if (error.name === 'format') {
        errName = error.params.format;
      }

      error.message = getErrorMessage(errName, error.params) || error.message;
    });

    return errors;
  };

  return (
    <FormContext.Provider value={{ imageUpload }}>
      <StyledForm
        customFormats={{ hexColor: /^#[0-9A-F]{6}$/i }}
        omitExtraData
        showErrorList={false}
        noHtml5Validate={true}
        onSubmit={({ formData, ...rest }) => {
          if (!onSubmit) {
            return;
          }

          return onSubmit({
            formData: recursivelyNormalizeData(formData),
            ...rest,
          });
        }}
        {...props}
        {...templates}
        // @ts-ignore
        fields={fields}
        widgets={widgets}
        transformErrors={transformErrors}
      >
        <Flex mx={4} mt={4} justify="center" align="center">
          {children}
        </Flex>
      </StyledForm>
    </FormContext.Provider>
  );
};
