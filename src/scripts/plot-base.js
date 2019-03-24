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
    this.render();
  }

  render() {
    const width = this.$container.clientWidth;
    const height = this.$container.clientHeight;

    this.$paths = {};
    this.$element = createSvgElement('svg', { preserveAspectRatio: 'none' });

    this.plotter = new Plotter({
      width,
      height,
      $svg: this.$element,
      x: this.x,
      graphs: this.graphs,
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

    this.plotter.updateDomain();

    animateViewBox({
      $svg: this.$element,
      to: this.plotter.viewBoxFromRatios(),
      duration: 200,
    });
  }
}

export default PlotBase;
