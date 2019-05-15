import heroInfo from '../src/js/classes/shortHeroInfo';

test('Show short info', () => {
  const hero = {
    level: 1,
    health: 50,
    type: 'magician',
    attack: 10,
    defence: 40,
    distance: 4,
    distanceAttack: 1,
  };

  const expected = '🎖1 ⚔10 🛡40 ❤50';
  const received = heroInfo(hero);
  expect(received).toEqual(expected);
});
