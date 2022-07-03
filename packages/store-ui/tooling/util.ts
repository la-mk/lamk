import { take } from "lodash";

export function sampleSize<T>(arr: T[], seed: number, n: number) {
  const shuffledArray = shuffle(arr, seed);
  return take(shuffledArray, n);
}

export function shuffle<T>(array: T[], seed: number) {
  let m = array.length,
    t,
    i;

  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed;
  }

  return array;
}

function random(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
