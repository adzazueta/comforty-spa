function getRandomNumber(min, max, decimals = 0) {
  const factor = Math.pow(10, decimals)
  return Math.floor(Math.random() * ((max - min) * factor + 1)) / factor + min;
}

export {
  getRandomNumber
}