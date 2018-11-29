export const uniqueId = (prefix = 'id') => {
  // Convert it to base 36 (numbers + letters), and grab the first 5 characters
  // after the decimal.
  return `${prefix}_${Math.random().toString(36).substr(2, 5)}`;
};

export const ommit = (object = {}, ommisionArray = []) => {
  return ommisionArray.reduce((acc, current) => {
    delete object[current];
    acc = { ...object };
    return acc;
  }, {});
};
