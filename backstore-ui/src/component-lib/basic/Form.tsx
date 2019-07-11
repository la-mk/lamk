import * as React from 'react';
import { default as AntForm, FormProps, FormItemProps } from 'antd/es/form';
import 'antd/lib/form/style/index.less';
import get from 'lodash/get';
import { clone, setWith, curry } from 'lodash/fp';
import { system } from '../system';

const setIn = curry((obj: any, value: any, path: string) =>
  setWith(clone, path, value, clone(obj)),
);

interface FormHandlers {
  onInputChanged?: (state: any, val: any, selector: string) => void;
  onInputCompleted?: (state: any, val: any, selector: string) => void;
  onFormCompleted?: (state: any) => void;
  validator?: (val: any, selector: string) => string | undefined;
}

interface FormContext {
  state: any;
  successes: any;
  errors: any;
  inputChangeHandler: (val: any, selector: string) => void;
  inputCompleteHandler: (val: any, selector: string) => void;
}

const { Provider, Consumer } = React.createContext<FormContext>({
  errors: {},
  successes: {},
  state: {},
  inputChangeHandler: () => null,
  inputCompleteHandler: () => null,
});

const StyledForm = system<FormProps>(AntForm);
const StyledFormItem = system<FormItemProps>(AntForm.Item as any);

export const Form = ({
  validator,
  onInputChanged,
  onInputCompleted,
  onFormCompleted,
  ...props
}: FormProps & FormHandlers) => {
  const [errors, setErrors] = React.useState({});
  const [successes, setSuccesses] = React.useState({});
  const [state, setState] = React.useState({});

  const inputChangeHandler = (e: any, selector: string) => {
    const val = e && e.target ? e.target.value : null;
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
    const val = e && e.target ? e.target.value : null;
    const error = validator && validator(val, selector);
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
    onFormCompleted && onFormCompleted(state);
  };

  return (
    <Provider
      value={{
        state,
        errors,
        successes,
        inputChangeHandler,
        inputCompleteHandler,
      }}
    >
      <StyledForm onSubmit={customSubmit} {...props} />
    </Provider>
  );
};

export const FormItem = ({
  selector,
  children,
  ...props
}: FormItemProps & {
  children: (
    currentVal: any,
    onChange: (val: any) => void,
    onComplete: (val: any) => void,
  ) => React.ReactNode;
  selector: string;
}) => {
  return (
    <Consumer>
      {context => {
        const error = get(context.errors, selector);
        const success = get(context.successes, selector);

        return (
          <StyledFormItem
            validateStatus={error ? 'error' : 'success'}
            help={error}
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
