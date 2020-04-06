// Picks the difference between the new and old object, useful when doing PATCH requests.
export const pickDiff = (oldObj: any, newObj: any) => {
  return Object.keys(newObj).reduce((diff, newKey) => {
    if (oldObj[newKey] !== newObj[newKey]) {
      diff[newKey] = newObj[newKey];
    }

    return diff;
  }, {});
};

export const getTextSnippet = (text: string | undefined) => {
  if (!text) {
    return;
  }

  const firstParagraph = text.split('\n')[0];
  if (firstParagraph && firstParagraph.length > 160) {
    return firstParagraph;
  }

  return text.slice(0, 250);
};
