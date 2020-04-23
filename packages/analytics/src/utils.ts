export const differenceInMinutes = (from: number, to: number) => {
  const diff = Math.abs(from - to);
  return diff / 60000;
};
