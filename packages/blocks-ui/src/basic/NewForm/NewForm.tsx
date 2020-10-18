import React from 'react';
import Form, { FormProps as RjsfFormProps, AjvError } from '@rjsf/core';
import fields from './fields';
import widgets from './widgets';
import templates from './templates';
import { Flex } from '../Flex';

export interface FormProps<T> extends RjsfFormProps<T> {
  getErrorMessage: (errorName: string, context: any) => string;
}

export const NewForm = <T extends any>({
  children,
  getErrorMessage,
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
