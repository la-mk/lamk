import identity from 'lodash/identity';
import * as React from 'react';
import { Form as AntForm } from 'antd';
import { FormProps, FormItemProps } from 'antd/es/form';
import 'antd/es/form/style/index.less';
import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { system, SystemProps } from '../../system';
import { Tabs, TabPane } from '../Tabs';

// This is not very performant, but it'll do for now.
const setIn = (obj = {}, value: any, path: string) => {
  const cloned = cloneDeep(obj);
  set(cloned, path, value);

  return cloned;
};

const getVal = (eventOrVal: any) => {
  // If it is an event, get the target value, otherwise assume the passed argument is the value itself.
  return eventOrVal && eventOrVal.target ? eventOrVal.target.value : eventOrVal;
};

const StyledForm = system<FormProps>(AntForm);
const StyledFormItem = system<FormItemProps>(AntForm.Item);

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
    selector: string
  ) => SingleValidationErrorResponse | undefined | null;
  getErrorMessage?: (
    errorName: string,
    context: { [key: string]: any }
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

  const inputChangeHandler = (val: any, selector: string) => {
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

  const inputCompleteHandler = (val: any, selector: string) => {
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

  const customSubmit = () => {
    // e.preventDefault();
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
      <StyledForm onFinish={customSubmit} {...props} />
    </Provider>
  );
};

interface FormItemContextProps {
  children: (
    currentVal: any,
    onChange: (val: any) => void,
    onComplete: (val: any) => void,
    state: any
  ) => React.ReactNode;
  selector: string;
  parser?: (val: any) => any;
}

interface FormListContextProps {
  children: (currentVal: any, index: number) => React.ReactNode;
  getItemTitle: (currentVal: any) => string;
  getDefaults: () => any;
  selector: string;
  as: 'tab';
  min?: number;
}

export const FormItem = ({
  selector,
  parser = identity,
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
              (val: any) =>
                context.inputChangeHandler(parser(getVal(val)), selector),
              (val: any) =>
                context.inputCompleteHandler(parser(getVal(val)), selector),
              context.state
            )}
          </StyledFormItem>
        );
      }}
    </Consumer>
  );
};

export const FormList = ({
  selector,
  getItemTitle,
  getDefaults,
  as = 'tab',
  min = 0,
  children,
}: SystemProps & FormListContextProps) => {
  const [active, setActive] = React.useState('0');
  
  return (
    <Consumer>
      {context => {
        const val = get(context.state, selector);
        if (!Array.isArray(val)) {
          throw new Error('FormList selector should point to an array item');
        }

        const onEdit = (
          targetKey: React.MouseEvent | React.KeyboardEvent | string,
          action: 'add' | 'remove'
        ) => {
          switch (action) {
            case 'add': {
              const newItems = [...val, getDefaults()];
              context.inputCompleteHandler(newItems, selector);
              // We want to make the new tab active
              setActive(val.length.toString())
              return;
            }
            case 'remove': {
              const newItems = val.filter((_entry, idx) => idx.toString() !== targetKey);
              context.inputCompleteHandler(newItems, selector);
              setActive((Math.max(val.length - 2, 0)).toString())
              return;
            }
          }
        };

        if (as === 'tab') {
          return (
            <Tabs activeKey={active} onChange={setActive} type="editable-card" onEdit={onEdit}>
              {val.map((entry, index) => {
                const title = getItemTitle(entry);
                return (
                  <TabPane tab={title} key={index.toString()} closable={index > min}>
                    {children(entry, index)}
                  </TabPane>
                );
              })}
            </Tabs>
          );
        }

        return null;
      }}
    </Consumer>
  );
};
