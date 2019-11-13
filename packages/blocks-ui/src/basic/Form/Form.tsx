import * as React from 'react';
import { Form as AntForm } from 'antd';
import { FormProps, FormItemProps } from 'antd/es/form';
import 'antd/es/form/style/index.less';
import get from 'lodash/get';
import { clone, setWith, curry } from 'lodash/fp';
import { system, SystemProps } from '../../system';

const setIn = curry((obj: any, value: any, path: string) =>
  setWith(clone, path, value, clone(obj)),
);

const getVal = (eventOrVal: any) => {
  // If it is an event, get the target value, otherwise assume the passed argument is the value itself.
  return eventOrVal && eventOrVal.target ? eventOrVal.target.value : eventOrVal;
};

const StyledForm = system<FormProps>(AntForm);
const StyledFormItem = system<FormItemProps>(AntForm.Item as any);

export interface SingleValidationErrorResponse {
  name: string;
  message: string;
  args?: any[];
}

export interface ValidationErrorResponse {
  [key: string]: SingleValidationErrorResponse;
}

export interface FormHandlers {
  onInputChanged?: (state: any, val: any, selector: string) => void;
  onInputCompleted?: (state: any, val: any, selector: string) => void;
  onFormCompleted?: (state: any) => void;
  validate?: (form: any) => ValidationErrorResponse | undefined | null;
  validateSingle?: (
    val: any,
    selector: string,
  ) => SingleValidationErrorResponse | undefined | null;
  getErrorMessage?: (
    errorName: string,
    context: { [key: string]: any },
  ) => string | undefined | null;
  externalState?: any;
}

interface FormContext {
  state: any;
  successes: any;
  errors: any;
  inputChangeHandler: (val: any, selector: string) => void;
  inputCompleteHandler: (val: any, selector: string) => void;
  getErrorMessage?: FormHandlers['getErrorMessage'];
}

const { Provider, Consumer } = React.createContext<FormContext>({
  errors: {},
  successes: {},
  state: {},
  inputChangeHandler: () => null,
  inputCompleteHandler: () => null,
});

export const Form = ({
  externalState,
  validate,
  validateSingle,
  onInputChanged,
  onInputCompleted,
  onFormCompleted,
  getErrorMessage,
  ...props
}: FormProps & SystemProps & FormHandlers) => {
  const [errors, setErrors] = React.useState({});
  const [successes, setSuccesses] = React.useState({});
  const [state, setState] = React.useState(externalState || {});
  React.useEffect(() => setState(externalState), [externalState]);

  const inputChangeHandler = (e: any, selector: string) => {
    const val = getVal(e);
    const nextState = setIn(state, val, selector);
    setState(nextState);

    if (onInputChanged) {
      onInputChanged(nextState, val, selector);
    }

    //Clear out error while user is typing, and do validation once they are done
    if (get(errors, selector)) {
      setErrors(setIn(errors, undefined, selector));
    }
  };

  const inputCompleteHandler = (e: any, selector: string) => {
    const val = getVal(e);
    const error = validateSingle && validateSingle(val, selector);
    const nextState = setIn(state, val, selector);
    setState(nextState);

    // Set the error in state, clear out the success message if there was any
    if (error) {
      setErrors(setIn(errors, error, selector));
      setSuccesses(setIn(successes, false, selector));
    } else {
      setErrors(setIn(errors, undefined, selector));
      setSuccesses(setIn(successes, true, selector));
    }

    if (onInputCompleted) {
      onInputCompleted(nextState, val, selector);
    }
  };

  const customSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitErrors = validate ? validate(state) : undefined;
    if (!submitErrors) {
      onFormCompleted && onFormCompleted(state);
      setSuccesses({});
    } else {
      setErrors(submitErrors);
    }
  };

  return (
    <Provider
      value={{
        state,
        errors,
        successes,
        inputChangeHandler,
        inputCompleteHandler,
        getErrorMessage,
      }}
    >
      <StyledForm onSubmit={customSubmit} {...props} />
    </Provider>
  );
};

interface FormItemContextProps {
  children: (
    currentVal: any,
    onChange: (val: any) => void,
    onComplete: (val: any) => void,
  ) => React.ReactNode;
  selector: string;
}

export const FormItem = ({
  selector,
  children,
  ...props
}: FormItemProps & SystemProps & FormItemContextProps) => {
  return (
    <Consumer>
      {context => {
        const error = get(context.errors, selector);
        const success = get(context.successes, selector);
        let help;
        if (error) {
          if (context.getErrorMessage) {
            help =
              context.getErrorMessage(error.name, { ...error.args }) ||
              error.message;
          } else {
            help = error.message;
          }
        }

        return (
          <StyledFormItem
            validateStatus={error ? 'error' : 'success'}
            help={help}
            hasFeedback={Boolean(error || success)}
            {...props}
          >
            {children(
              get(context.state, selector),
              (val: any) => context.inputChangeHandler(val, selector),
              (val: any) => context.inputCompleteHandler(val, selector),
            )}
          </StyledFormItem>
        );
      }}
    </Consumer>
  );
};
