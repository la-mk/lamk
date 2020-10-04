import { FormatDefinition, KeywordDefinition } from 'ajv';
import { isEqual, uniq, uniqWith, get } from 'lodash';
import { toArrayPath } from './utils';

const HEX_REGEX = /^#[0-9A-F]{6}$/i;

export const keywords: KeywordDefinition[] = [
  {
    keyword: 'uniqueOn',
    type: 'array',
    validate: (uniqueSelector: string, data: any[]) => {

    const selector = toArrayPath(uniqueSelector);
    const unique = selector.length > 0
      ? uniqWith(data, (first, second) => isEqual(get(first, selector), get(second,selector)))
      : uniq(data);
      
      return data.length === unique.length;
    },
  },

  // This makes sure that every object has the same schema, so if a field is optional, it ensures either all objects have it or none has it.
  {
    keyword: 'equalSchema',
    type: 'array',
    validate: (uniqueSelector: string, data: any[]) => {
      if(data.length === 0){
        return true;
      }
      const selector = toArrayPath(uniqueSelector);
  
      const first = selector.length > 0 ? get(data[0], selector) : data[0];
      const baseKeys = first ? Object.entries(first).filter(([_, val]) => val != null).map(([key]) => key).sort() : [];
      return data.every(val => {
        const selected = selector.length > 0 ? get(val, selector) : val;
        const keys = selected ? Object.entries(selected).filter(([_, val]) => val != null).map(([key]) => key).sort() : [];
        return isEqual(baseKeys, keys);
      })
    },
  }
]


export const formats: {name: string, format: FormatDefinition<string>}[] = [
  {
    name: 'hexColor',
    format: {
      type: 'string',
      validate: (value: string) => HEX_REGEX.test(value)
    }
  }
]