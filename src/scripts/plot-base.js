import Plotter from './plotter';
import { animateViewBox } from './animation';
import { createSvgElement, objectForEach } from './utils';
import { BaseAnimationDuration } from './constants';

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

    this.$element = createSvgElement('svg', { preserveAspectRatio: 'none' });

    this.plotter = new Plotter({
      width,
      height,
      $svg: this.$element,
      x: this.x,
      graphs: this.graphs,
    });

    this.renderPathLines();
    this.$container.appendChild(this.$element);
  }

  renderPathLines() {
    this.$paths = {};

    objectForEach(this.graphs, (key, { color }) => {
      this.$paths[key] = createSvgElement('path', {
        d: this.plotter.getPathLine(key),
        stroke: color,
      });

      this.$element.appendChild(this.$paths[key]);
    });
  }

  updatePathLines() {
    objectForEach(this.graphs, key => {
      this.$paths[key].setAttribute('d', this.plotter.getPathLine(key));
    });
  }

  update() {
    objectForEach(this.graphs, (key, { visible }) => {
      this.$paths[key].classList.toggle('hidden', !visible);
    });

    this.plotter.updateDomain();

    animateViewBox({
      $svg: this.$element,
      to: this.plotter.viewBoxFromRatios(),
      duration: BaseAnimationDuration,
    });
  }

  resize() {
    const width = this.$container.clientWidth;
    const height = this.$container.clientHeight;

    this.plotter.resize(width, height);
    this.updatePathLines();
  }
}

export default PlotBase;
