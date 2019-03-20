import Plotter from './plotter';
import { animateViewBox } from './animation';
import { createSvgElement } from './utils';

const numberOfLabels = 6;
const textMargin = 8;

class YAxis {
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
    this.$element = createSvgElement('svg', {
      width: this.plotter.width,
      height: this.plotter.height,
      viewBox: this.plotter.viewBoxFromScreen(),
      preserveAspectRatio: 'none',
      classes: 'yaxis',
    });

    const yRange = this.plotter.domain.y;
    const delta = yRange[1] - yRange[0];

    // TODO: зафиксировать шаги тиков
    // TODO: не скейлить лейблы — div?
    // TODO: пересчитывать текущие тики
    // TODO: анимировать тики

    const step = Math.floor(delta / numberOfLabels);
    const linesCount = Math.floor(delta / step);

    this.$texts = createSvgElement('g', {});

    [...Array(linesCount).keys()].forEach(index => {
      const value = yRange[0] + index * step;
      const y = this.plotter.toScreenY(value);

      const line = createSvgElement('line', {
        x1: 0,
        x2: this.plotter.width,
        y1: y,
        y2: y,
        'vector-effect': 'non-scaling-stroke',
      });

      const text = createSvgElement('text', {
        x: 0,
        y: y - textMargin,
      });

      const textNode = document.createTextNode(value);

      text.appendChild(textNode);
      this.$texts.appendChild(text);
      this.$element.appendChild(line);
    });

    this.$element.appendChild(this.$texts);
    this.$container.appendChild(this.$element);
  }

  update() {
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
      duration: 400,
    });
  }
}

export default YAxis;
