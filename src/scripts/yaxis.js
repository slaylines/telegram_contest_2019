import { createElement, debounce } from './utils';

const numberOfLabels = 6;
const textMargin = 4;
const topMargin = 20;

class YAxis {
  constructor({ x, graphs, plotter }) {
    this.x = x;
    this.graphs = graphs;
    this.plotter = plotter;
    this.update = debounce(this.update, this, 200);
  }

  appendTo($container) {
    this.$container = $container;
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
    const [ymin, ymax] = this.plotter.screen.y;
    const delta = ymax - topMargin - ymin;
    const step = delta / (numberOfLabels - 1);

    const lines = [];
    const labels = [];

    for (let index = 0; index < numberOfLabels; ++index) {
      const y = ymin + topMargin + index * step;
      const value = Math.round(this.plotter.toDomainY(y, true));

      const line = createElement('hr', { style: { top: `${y}px` } });
      const text = createElement('div', {
        style: { top: `${y - textMargin}px` },
      });

      text.innerText = value;

      lines.push(line);
      labels.push(text);
    }

    return { lines, labels };
  }

  update() {
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
