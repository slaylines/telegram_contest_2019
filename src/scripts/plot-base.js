import Plotter from './plotter';
import { animateViewBox } from './animation';
import { createSvgElement, objectForEach } from './utils';

class PlotBase {
  constructor({ x, graphs }) {
    this.x = x;
    this.graphs = graphs;
  }

  appendTo($container) {
    this.$container = $container;
    this.plotter = new Plotter(this);
    this.render();
  }

  render() {
    this.$paths = {};
    this.$element = createSvgElement('svg', {
      width: this.plotter.width,
      height: this.plotter.height,
      viewBox: this.plotter.viewBoxFromScreen(),
      preserveAspectRatio: 'none',
    });

    objectForEach(this.graphs, (key, { color }) => {
      this.$paths[key] = createSvgElement('path', {
        d: this.plotter.getPathLine(key),
        stroke: color,
      });

      this.$element.appendChild(this.$paths[key]);
    });

    this.$container.appendChild(this.$element);
  }

  update() {
    objectForEach(this.graphs, (key, { visible }) => {
      this.$paths[key].classList.toggle('hidden', !visible);
    });

    const viewBox = this.$element
      .getAttribute('viewBox')
      .split(' ')
      .map(v => +v);
    const newViewBox = this.plotter
      .viewBoxFromRange(this.x[0], this.x[this.x.length - 1])
      .split(' ')
      .map(v => +v);

    animateViewBox({
      $svg: this.$element,
      from: viewBox,
      to: newViewBox,
      duration: 200,
    });
  }
}

export default PlotBase;
