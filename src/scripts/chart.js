import Plot from './plot';
import Timeline from './timeline';
import Filter from './filter';
import Plotter from './plotter';
import { ChartType } from './constants';
import {
  createElement,
  createSvgElement,
  pairsToObject,
  objectFilter,
  objectMap,
  min,
  max,
} from './utils';

const xKeyFromTypes = types =>
  Object.keys(objectFilter(types, (key, type) => type === ChartType.x))[0];

const columnsByKey = columns =>
  pairsToObject(columns.map(([key, ...values]) => [key, values]));

class Chart {
  constructor(name, { columns, types, colors, names }) {
    const namedColumns = columnsByKey(columns);
    const xKey = xKeyFromTypes(types);
    const xColumn = namedColumns[xKey];
    const graphColumns = objectFilter(namedColumns, key => key !== xKey);

    this.name = name;
    this.x = xColumn;
    this.graphs = objectMap(graphColumns, (key, values) => ({
      values,
      type: types[key],
      color: colors[key],
      name: names[key],
      visible: true,
    }));
  }

  appendTo($container) {
    this.$container = $container;
    this.render();
  }

  render() {
    this.$element = document.createElement('figure');
    this.$container.appendChild(this.$element);

    this.$plot = createElement('section', { classes: 'plot' });
    this.$timeline = createElement('section', { classes: 'timeline' });
    this.$filter = createElement('section', { classes: 'filter' });

    this.$element.appendChild(this.$plot);
    this.$element.appendChild(this.$timeline);
    this.$element.appendChild(this.$filter);

    this.plotter = new Plotter(this);

    this.plot = new Plot({
      plotter: this.plotter,
      x: this.x,
      graphs: this.graphs,
    });

    this.timeline = new Timeline({
      plotter: this.plotter,
      x: this.x,
      graphs: this.graphs,
    });

    this.filter = new Filter({
      graphs: this.graphs,
      onFilterToggle: this.onFilterToggle.bind(this),
    });

    this.plot.appendTo(this.$plot);
    // this.timeline.appendTo(this.$timeline);
    this.filter.appendTo(this.$filter);
  }

  onFilterToggle(key, visible) {
    this.graphs[key].visible = visible;

    this.plot.update();
  }
}

export default Chart;
