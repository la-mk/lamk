import { upperFirst } from 'lodash';

const to = {
  a: 'а',
  b: 'б',
  v: 'в',
  g: 'г',
  d: 'д',
  gj: 'ѓ',
  e: 'е',
  zh: 'ж',
  z: 'з',
  dz: 'ѕ',
  i: 'и',
  j: 'ј',
  k: 'к',
  l: 'л',
  lj: 'љ',
  m: 'м',
  n: 'н',
  nj: 'њ',
  o: 'о',
  p: 'п',
  r: 'р',
  s: 'с',
  t: 'т',
  kj: 'ќ',
  u: 'у',
  f: 'ф',
  h: 'х',
  c: 'ц',
  ch: 'ч',
  dj: 'џ',
  sh: 'ш',
} as { [key: string]: string };

const from = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  ѓ: 'gj',
  е: 'e',
  ж: 'zh',
  з: 'z',
  ѕ: 'dz',
  и: 'i',
  ј: 'j',
  к: 'k',
  л: 'l',
  љ: 'lj',
  м: 'm',
  н: 'n',
  њ: 'nj',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  ќ: 'kj',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'ch',
  џ: 'dj',
  ш: 'sh',
} as { [key: string]: string };

// We can use normal uppercase for latin letters, but we need locale-specific uppercase for non-latin letters
const fromCaps = Object.entries(from).reduce((fromCaps: any, [key, val]) => {
  fromCaps[key.toLocaleUpperCase('mk-MK')] = upperFirst(val);
  return fromCaps;
}, {});

const toCaps = Object.entries(to).reduce((toCaps: any, [key, val]) => {
  toCaps[upperFirst(key)] = val.toLocaleUpperCase('mk-MK');
  return toCaps;
}, {});

// There are no digraphs when transliterating to Macedonian, so we can just iterate one by one.
export const transliterateFrom = (text: string) => {
  if (!text || !text.length) {
    return text;
  }

  // Strings are immutable, so we push to an array instead and join at the end.
  const buffer = [];
  for (const a of text) {
    buffer.push(from[a] ?? fromCaps[a] ?? a);
  }

  return buffer.join('');
};

export const transliterateTo = (text: string) => {
  if (!text || !text.length) {
    return text;
  }

  const buffer = [];
  // Since there are digraphs when transliterating to Macedonian, we need to look-ahead.
  for (let i = 0; i < text.length; i++) {
    // If it is the last character, we know there are no digraphs, so we just push it and end the loop;
    if (i === text.length - 1) {
      buffer.push(to[text[i]] ?? toCaps[text[i]] ?? text[i]);
      break;
    } 

    const digraph = text[i] + text[i + 1];

    // If it is a digraph, push that and increase index
    if (to[digraph] ?? toCaps[digraph]) {
      buffer.push(to[digraph] ?? toCaps[digraph]);
      i++;
    } else {
      buffer.push(to[text[i]] ?? toCaps[text[i]] ?? text[i]);
    }
  }

  return buffer.join('');
};
