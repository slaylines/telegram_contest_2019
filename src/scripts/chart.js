import { ChartType } from './constants';
import { pairsToObject, objectFilter, objectMap } from './utils';

const xKeyFromTypes = types =>
  Object.keys(objectFilter(types, (key, type) => type === ChartType.x))[0];

const columnsByKey = columns =>
  pairsToObject(columns.map(([key, ...values]) => [key, values]));

class Chart {
  constructor({ columns, types, colors, names }) {
    const namedColumns = columnsByKey(columns);
    const xKey = xKeyFromTypes(types);
    const xColumn = namedColumns[xKey];
    const graphColumns = objectFilter(namedColumns, key => key !== xKey);

    this.x = xColumn.map(value => ({ timestamp: value }));
    this.graphs = objectMap(graphColumns, (key, values) => ({
      values,
      type: types[key],
      color: colors[key],
      name: names[key],
    }));
  }

  render() {
    return document.createElement('figure');
  }
}

export default Chart;
