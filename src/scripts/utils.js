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
