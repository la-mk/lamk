import React from 'react';
import Form, { FormProps as RjsfFormProps, AjvError } from '@rjsf/core';
import fields from './fields';
import widgets from './widgets';
import templates from './templates';
import { Flex } from '../Flex';

export interface FormProps<T> extends RjsfFormProps<T> {
  getErrorMessage: (errorName: string, context: any) => string;
}

const recursiveSetUndefinedToValue = (data: any, value: any = null) => {
  if (!data || !(typeof data === 'object')) {
    return data;
  }

  Object.entries(data).forEach(([key, val]) => {
    if (typeof data[key] === 'object') {
      return recursiveSetUndefinedToValue(data[key], value);
    }

    if (val === undefined) {
      data[key] = value;
      return;
    }
  });

  return data;
};

export const NewForm = <T extends any>({
  children,
  getErrorMessage,
  onSubmit,
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
    <Form
      showErrorList={false}
      noHtml5Validate={true}
      onSubmit={({ formData, ...rest }) => {
        if (!onSubmit) {
          return;
        }

        return onSubmit({
          formData: recursiveSetUndefinedToValue(formData),
          ...rest,
        });
      }}
      {...props}
      {...templates}
      fields={fields}
      widgets={widgets}
      transformErrors={transformErrors}
    >
      <Flex mt={3} justifyContent="center" alignItems="center">
        {children}
      </Flex>
    </Form>
  );
};
