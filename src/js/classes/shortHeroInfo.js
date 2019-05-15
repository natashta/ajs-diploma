
export default function heroInfo(hero) {
  const smileLevel = String.fromCodePoint(0x1F396);
  const smileAttack = String.fromCodePoint(0x2694);
  const smileDefence = String.fromCodePoint(0x1F6E1);
  const smileHealth = String.fromCodePoint(0x2764);
  const result = `${smileLevel}${hero.level} ${smileAttack}${hero.attack} ${smileDefence}${hero.defence} ${smileHealth}${hero.health}`;
  return result;
}
