const pickRandom = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return { element: array[index], index };
};

const pluckRandom = (array) => {
  const { element, index } = pickRandom(array);
  const start = array.slice(0, index);
  const end = array.slice(index + 1);
  return { element, array: [...start, ...end] };
};

exports.pickRandom = pickRandom;
exports.pluckRandom = pluckRandom;
