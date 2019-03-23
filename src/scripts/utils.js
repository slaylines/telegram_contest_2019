const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const min = array => Math.min(...array);

export const max = array => Math.max(...array);

export const viewBoxToArray = viewBox =>
  viewBox.split(' ').map(value => +value);

export const arrayToViewBox = array => array.join(' ');

export const closestLeftIndexOf = (array, value) =>
  array.findIndex(
    (_, index) =>
      array[index] === value ||
      (array[index] < value && value < array[index + 1])
  );

export const closestRightIndexOf = (array, value) =>
  array.findIndex(
    (_, index) =>
      array[index] === value ||
      (array[index - 1] < value && value < array[index])
  );

export const createElement = (
  tag,
  { classes = '', style = {}, ...options } = {}
) => {
  const element = document.createElement(tag);

  element.className = classes;
  Object.assign(element.style, style);

  objectForEach(options || {}, (key, value) =>
    element.setAttribute(key, value)
  );

  return element;
};

export const createSvgElement = (tag, { classes = '', ...options }) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  element.setAttribute('class', classes);

  objectForEach(options || {}, (key, value) =>
    element.setAttribute(key, value)
  );

  return element;
};

export const pairsToObject = pairs =>
  pairs.reduce((acc, [key, value]) => ((acc[key] = value), acc), {});

export const objectFilter = (obj, func) =>
  pairsToObject(Object.entries(obj).filter(([key, value]) => func(key, value)));

export const objectMap = (obj, func) =>
  pairsToObject(
    Object.entries(obj).map(([key, value]) => [key, func(key, value)])
  );

export const objectForEach = (obj, func) =>
  Object.entries(obj).forEach(([key, value]) => func(key, value));

export const formatDate = timestamp => {
  const date = new Date(timestamp);

  return `${days[date.getUTCDay()]}, ${
    months[date.getUTCMonth()]
  } ${date.getUTCDate()}`;
};

export const debounce = (func, context) => {
  let timeout;

  return (...args) => {
    if (timeout) cancelAnimationFrame(timeout);
    timeout = requestAnimationFrame(() => {
      func.call(context, ...args);
    });
  };
};
