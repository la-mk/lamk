import {transliterateFrom as transliterateFromMk, transliterateTo as transliterateToMk} from './languages/mk';

const getFrom = (text: string, from: string) => {
  switch(from) {
    // The target language for transliteration is english (the english alphabet), so we just return the text as is
    case 'en': {
      return text;
    }
    case 'mk': {
      return transliterateFromMk(text)
    }
    default: {
      return text;
    }
  }
}

const getTo = (text: string, to: string) => {
  switch(to) {
    // The target language for transliteration is english (the english alphabet), so we just return the text as is
    case 'en': {
      return text;
    }
    case 'mk': {
      return transliterateToMk(text)
    }
    default: {
      return text;
    }
  }
}

export const transliterate = (text: string, from: string, to: string) => {
  const normalizedText = text.normalize();
  const fromTransliterated = getFrom(normalizedText, from);
  const toTransliterated = getTo(fromTransliterated, to);
  return toTransliterated;
}