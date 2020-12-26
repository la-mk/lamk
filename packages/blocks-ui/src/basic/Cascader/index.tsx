import React from 'react';
import RCCascader from 'rc-cascader';
import { TreeviewEntry } from 'basic/Treeview';
import { Input, InputProps } from '../Input';

export interface CascaderProps extends Omit<InputProps, 'value' | 'onChange'> {
  items: TreeviewEntry[];
  value?: Array<string | number>;
  onChange: (v: Array<string | number>) => void;
}

const checkItemBelongs = (searchValue: string, item: TreeviewEntry) => {
  return (
    item.title.toLowerCase().startsWith(searchValue) ||
    item.key.startsWith(searchValue)
  );
};

const getFilteredItems = (
  searchValue: string,
  items: TreeviewEntry[]
): TreeviewEntry[] => {
  // @ts-ignore
  return items
    .map(item => {
      if (checkItemBelongs(searchValue, item)) {
        return item;
      } else {
        if (item.children) {
          const filteredChildren = getFilteredItems(searchValue, item.children);
          if (filteredChildren.length === 0) {
            return undefined;
          }

          return {
            ...item,
            children: filteredChildren,
          };
        } else {
          if (checkItemBelongs(searchValue, item)) {
            return item;
          }

          return undefined;
        }
      }
    })
    .filter(x => !!x);
};

const getDisplayVal = (
  value: Array<string | number>,
  items: TreeviewEntry[],
  res = ''
): string => {
  if (!value) {
    return '';
  }

  const current = items.find(x => x.key === value[0]);
  if (!current) {
    return '';
  }

  if (!current.children) {
    return res + current.title;
  }

  return getDisplayVal(
    value.slice(1),
    current.children,
    res + current.title + '/'
  );
};

export const Cascader = ({
  items,
  value,
  onChange,
  ...props
}: CascaderProps) => {
  const [searchValue, setSearchValue] = React.useState('');
  const filteredItems = getFilteredItems(searchValue, items);
  const displayName = getDisplayVal(value as any, items);
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  return (
    <RCCascader
      onKeyDown={e => {
        if (e.key === 'Backspace') {
          if (e.metaKey || e.ctrlKey) {
            setSearchValue('');
          }

          setSearchValue(x => x.slice(0, x.length - 1));
        }
      }}
      options={filteredItems}
      fieldNames={{ label: 'title', value: 'key', children: 'children' }}
      onChange={(val, x) => {
        console.log(val, x);
        setSearchValue('');
        onChange(val);
      }}
      onPopupVisibleChange={visible => {
        setSearchValue('');
        setIsInputFocused(visible);
      }}
      value={value}
    >
      <Input
        type="search"
        {...props}
        value={isInputFocused ? searchValue : displayName}
        placeholder={value ? displayName : props.placeholder}
        onBlur={() => {
          setSearchValue('');
          setIsInputFocused(false);
        }}
        onSearch={setSearchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
    </RCCascader>
  );
};
