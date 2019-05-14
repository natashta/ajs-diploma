/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  for (let i = 0; i < allowedTypes.length; i += 1)  {
      const level = Math.ceil(Math.random() * (maxLevel - 1));
      const hero = new hero[i](level);
      maxLevel += 1;
      yield hero;
    }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const heroGenerator = characterGenerator(allowedTypes, maxLevel);
  const team = [];
  for (let i = 0; i < characterCount; i++) {
    result.push(heroGenerator.next().value);
  }
  return team;
}
