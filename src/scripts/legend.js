import Plotter from './plotter';
import { createElement, objectForEach, formatDate } from './utils';

class Legend {
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
    this.$element = createElement('div', { classes: 'legend' });
    this.$container.appendChild(this.$element);

    this.line = createElement('hr', { classes: 'legend-line' });

    this.$element.appendChild(this.line);

    this.circles = {};
    objectForEach(this.graphs, (key, { color }) => {
      this.circles[key] = createElement('div', {
        classes: 'legend-circle',
        style: { 'border-color': color },
      });

      this.$element.appendChild(this.circles[key]);
    });

    this.data = createElement('div', { classes: 'legend-data' });
    this.$element.appendChild(this.data);

    this.$element.addEventListener('mousemove', event => {
      this.onMouseMove(event);
    });
    this.$element.addEventListener('mouseleave', () => {
      this.onMouseLeave();
    });
  }

  onMouseMove(event) {
    const dateTime = this.plotter.toDomainX(event.offsetX);

    const position = this.x.reduce((prev, value, i, array) => {
      return Math.abs(value - dateTime) < Math.abs(array[prev] - dateTime)
        ? i
        : prev;
    }, 0);

    const x = this.x[position];
    const xCoord = this.plotter.toScreenX(x);

    this.line.style['left'] = `${xCoord}px`;
    this.line.style['opacity'] = 1;

    objectForEach(this.graphs, (key, { values, visible }) => {
      if (visible) {
        this.circles[key].style['left'] = `${xCoord}px`;
        this.circles[key].style['top'] = `${this.plotter.toScreenYInRange(
          values[position]
        )}px`;
        this.circles[key].style['opacity'] = 1;
      } else {
        this.circles[key].style['opacity'] = 0;
      }
    });

    let text = formatDate(x);
    text += '<div class="values">';
    objectForEach(this.graphs, (key, { color, values, visible }) => {
      if (visible) {
        text += `<div style="color: ${color}">${
          values[position]
        }</br><span>${key}</span></div>`;
      }
    });
    text += '</div>';

    this.data.innerHTML = text;

    this.data.style['opacity'] = 1;

    const width = this.data.clientWidth;
    this.data.style['left'] = `${Math.min(
      this.plotter.width - width / 2,
      Math.max(xCoord, width / 2)
    )}px`;
  }

  onMouseLeave() {
    this.line.style['opacity'] = 0;
    this.data.style['opacity'] = 0;

    objectForEach(this.circles, key => {
      this.circles[key].style['opacity'] = 0;
    });
  }
}

export default Legend;
