/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  for (const heroClass of allowedTypes) {
    yield new heroClass(maxLevel);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const hero = characterGenerator(allowedTypes, maxLevel);
  const team = [];

  for (let i = 0; i < characterCount; i += 1) {
    team.push(hero.next().value);
  }

  return team;
}
