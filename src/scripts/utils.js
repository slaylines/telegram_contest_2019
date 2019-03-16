export const pairsToObject = pairs =>
  pairs.reduce((acc, [key, value]) => ((acc[key] = value), acc), {});

export const filterObject = (obj, func) =>
  pairsToObject(Object.entries(obj).filter(([key, value]) => func(key, value)));

export const mapObject = (obj, func) =>
  pairsToObject(
    Object.entries(obj).map(([key, value]) => [key, func(key, value)])
  );
