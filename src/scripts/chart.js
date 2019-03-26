import Plot from './plot';
import Timeline from './timeline';
import Filter from './filter';
import { ChartType } from './constants';
import {
  createElement,
  pairsToObject,
  objectFilter,
  objectMap,
  debounce,
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

    this.resize = debounce(this.resize, this);
    window.addEventListener('resize', this.resize);
  }

  appendTo($container) {
    this.$container = $container;
    this.render();
  }

  render() {
    this.$element = document.createElement('figure');
    this.$container.appendChild(this.$element);

    this.renderTitle();
    this.renderPlot();
    this.renderTimeline();
    this.renderFilter();
  }

  resize() {
    this.plot.resize();
    this.timeline.resize();
  }

  renderTitle() {
    this.$title = createElement('h1');
    this.$title.innerText = this.name;
    this.$element.appendChild(this.$title);
  }

  renderPlot() {
    this.$plot = createElement('section', { classes: 'plot' });
    this.$element.appendChild(this.$plot);

    this.plot = new Plot({
      x: this.x,
      graphs: this.graphs,
    });

    this.plot.appendTo(this.$plot);
  }

  renderTimeline() {
    this.$timeline = createElement('section', { classes: 'timeline' });
    this.$element.appendChild(this.$timeline);

    this.timeline = new Timeline({
      x: this.x,
      graphs: this.graphs,
      onTimelineChange: this.onTimelineChange.bind(this),
      onTimelineEnd: this.onTimelineEnd.bind(this),
    });

    this.timeline.appendTo(this.$timeline);
  }

  renderFilter() {
    this.$filter = createElement('section', { classes: 'filter' });
    this.$element.appendChild(this.$filter);

    this.filter = new Filter({
      graphs: this.graphs,
      onFilterToggle: this.onFilterToggle.bind(this),
    });

    this.filter.appendTo(this.$filter);
  }

  onFilterToggle(key, visible) {
    this.graphs[key].visible = visible;

    this.plot.update();
    this.timeline.update();
  }

  onTimelineChange(left, right) {
    this.plot.updateViewport(left, right);
    this.plot.updateXAxis();
  }

  onTimelineEnd(left, right) {
    this.plot.updateYAxis(left, right);
  }
}

export default Chart;
