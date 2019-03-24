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

export const leftIndexFromRatio = (array, ratio) =>
  Math.floor((array.length - 1) * ratio);

export const rightIndexFromRatio = (array, ratio) =>
  Math.ceil((array.length - 1) * ratio);

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

export const formatAxisDate = timestamp => {
  const date = new Date(timestamp);

  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
};

export const debounce = (func, context, delay = 0) => {
  let timeout;

  return (...args) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(
      () => requestAnimationFrame(func.bind(context, ...args)),
      delay
    );
  };
};

export const nearestPow = value =>
  Math.pow(2, Math.round(Math.log(value) / Math.log(2)));
