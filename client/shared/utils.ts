export function getRegexMatches(string: string, regex: RegExp, index?: number) {
  index || (index = 1); // default to the first capturing group
  const matches = [];
  let match;

  while ((match = regex.exec(string))) {
    matches.push(match[index]);
  }
  return matches;
}

export const IsJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
