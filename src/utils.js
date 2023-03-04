exports.pickRandom = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return { element: array[index], index };
};

exports.pluckRandom = (array) => {
  const { element, index } = this.pickRandom(array);
  const start = array.slice(0, index);
  const end = array.slice(index + 1);
  return { element, array: [...start, ...end] };
};
