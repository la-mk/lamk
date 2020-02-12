import { transliterate } from '../src/index';

const fromFixtures = [
  ['текст без големи букви', 'tekst bez golemi bukvi'],
  ['ТексТ Со Големи Букви', 'TeksT So Golemi Bukvi'],
  ['Текст со неалфабетски знаци!?!', 'Tekst so nealfabetski znaci!?!'],
  ['безместо', 'bezmesto'],
  ['ф', 'f'],
  ['ѕ', 'dz'],
  // TODO: There is a bug in the Macedonian language support (on Mac at least) where a lowercase dz is typed with the correct unicode character, but an uppercase one is considered to be equal with S.
  [String.fromCodePoint(1029), 'Dz'], 
  ['Ќе играме џенга со Њутн', 'Kje igrame djenga so Njutn'],
  ['Мешано so latinica.', 'Meshano so latinica.'],
];

// Cut out the cyrillic and latin mix as there is no way to retrieve that information when converting back.
const toFixtures = fromFixtures.map(([from, to]) => [to, from]).slice(0, fromFixtures.length - 1);

describe('Macedonian', () => {
  it('transliterates from Macedonian successfully', () => {
    fromFixtures.forEach(([from, to]) => {
      expect(transliterate(from, 'mk', 'en')).toEqual(to);
    })
  });

  it('transliterates to Macedonian successfully', () => {
    toFixtures.forEach(([from, to]) => {
      expect(transliterate(from, 'en', 'mk')).toEqual(to);
    })
  });
});
