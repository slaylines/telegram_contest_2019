import Plotter from './plotter';
import { createElement } from './utils';

const numberOfLabels = 5;
const textMargin = 4;

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
    this.$element = createElement('div', { classes: 'yaxis' });

    const { lines, labels } = this.renderLables();
    this.lines = lines;
    this.labels = labels;

    this.labels.forEach($label => {
      this.$element.appendChild($label);
    });
    this.lines.forEach($line => {
      this.$element.appendChild($line);
    });

    this.$container.appendChild(this.$element);
  }

  renderLables() {
    const yRange = this.plotter.domain.y;
    const delta = yRange[1] - yRange[0];

    const step = Math.round(delta / numberOfLabels);

    const lines = [];
    const labels = [];

    [...Array(numberOfLabels).keys()].forEach(index => {
      const value = yRange[0] + index * step;
      const y = this.plotter.toScreenY(value);

      const line = createElement('hr', { style: { top: `${y}px` } });
      const text = createElement('div', {
        style: { top: `${y - textMargin}px` },
      });

      text.innerText = value;

      lines.push(line);
      labels.push(text);
    });

    return { lines, labels };
  }

  update() {
    this.plotter.updateDomain();

    const { labels, lines } = this.renderLables();
    const distance = this.plotter.height / numberOfLabels;

    this.labels.forEach($label => {
      $label.style['transform'] = `translateY(-${distance}px)`;
      $label.classList.toggle('hidden');

      setTimeout(() => {
        this.$element.removeChild($label);
      }, 200);
    });

    this.lines.forEach($line => {
      $line.style['transform'] = `translateY(${-distance}px)`;
      $line.classList.toggle('hidden');

      setTimeout(() => {
        this.$element.removeChild($line);
      }, 200);
    });

    this.labels = labels;
    this.lines = lines;

    this.labels.forEach($label => {
      this.$element.appendChild($label);
    });
    this.lines.forEach($line => {
      this.$element.appendChild($line);
    });
  }
}

export default YAxis;
