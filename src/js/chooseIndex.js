export function allowedAttack(position, distance) {
  const allBoard = [];
  let arrStr = [];
  const boardSize = 8;
  const indexLength = boardSize ** 2;
  // создаем массив индексов поля
  for (let i = 0; i < indexLength; i += 1) {
    arrStr.push(i);
    if (arrStr.length === boardSize) {
      allBoard.push(arrStr);
      arrStr = [];
    }
  }

  const indexStr = Math.floor(position / boardSize);
  const indexCol = position % boardSize;
  const allowedAttackIndex = [];
  let left = indexCol - distance;
  if (left < 0) left = 0;
  let top = indexStr - distance;
  if (top < 0) top = 0;
  let right = indexCol + distance;
  if (right > boardSize - 1) right = boardSize - 1;
  let bottom = indexStr + distance;
  if (bottom > boardSize - 1) bottom = boardSize - 1;

  for (let i = top; i <= bottom; i += 1) {
    for (let j = left; j <= right; j += 1) {
      allowedAttackIndex.push(allBoard[i][j]);
    }
  }
  return allowedAttackIndex.filter(item => item !== position);
}

export function allowedMove(position, distance) {
  const allBoard = [];
  let arrStr = [];
  const boardSize = 8;
  const indexLength = boardSize ** 2;
  // создаем массив индексов поля
  for (let i = 0; i < indexLength; i += 1) {
    arrStr.push(i);
    if (arrStr.length === boardSize) {
      allBoard.push(arrStr);
      arrStr = [];
    }
  }

  const indexStr = Math.floor(position / boardSize);
  const indexCol = position % boardSize;
  const allowedIndex = [];
  for (let i = 1; i <= distance; i += 1) {
    let allowedCol = indexCol + i;
    if (allowedCol < boardSize) { allowedIndex.push(allBoard[indexStr][allowedCol]); }

    let allowedStr = indexStr + i;
    if (allowedStr < boardSize) { allowedIndex.push(allBoard[allowedStr][indexCol]); }
    if ((allowedCol < boardSize) && (allowedStr < boardSize)) { allowedIndex.push(allBoard[allowedStr][allowedCol]); }

    allowedCol = indexCol - i;
    if (allowedCol >= 0) { allowedIndex.push(allBoard[indexStr][allowedCol]); }
    if ((allowedCol >= 0) && (allowedStr < boardSize)) { allowedIndex.push(allBoard[allowedStr][allowedCol]); }

    allowedStr = indexStr - i;
    if (allowedStr >= 0) { allowedIndex.push(allBoard[allowedStr][indexCol]); }
    if ((allowedCol >= 0) && (allowedStr >= 0)) { allowedIndex.push(allBoard[allowedStr][allowedCol]); }

    allowedCol = indexCol + i;
    if ((allowedCol < boardSize) && (allowedStr >= 0)) { allowedIndex.push(allBoard[allowedStr][allowedCol]); }
  }
  return allowedIndex;
}
