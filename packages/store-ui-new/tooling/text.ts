export const getTextSnippet = (text: string | undefined) => {
  if (!text) {
    return;
  }

  const firstParagraph = text.split("\n")[0];
  if (firstParagraph && firstParagraph.length > 160) {
    return firstParagraph;
  }

  return text.slice(0, 250);
};
