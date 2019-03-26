import { createElement, formatAxisDate, nearestPow } from './utils';

const labelWidth = 50;
const initialDistance = 90;

class XAxis {
  constructor({ x, plotter }) {
    this.x = x;
    this.plotter = plotter;
  }

  appendTo($container) {
    this.$container = $container;
    this.render();
  }

  render() {
    this.$element = createElement('div', { classes: 'xaxis' });
    this.$container.appendChild(this.$element);

    this.$labels = [];
    this.visibleLabels = [];
    this.renderLabels();

    this.renderShadows();
  }

  renderLabels() {
    this.x.forEach((x, index) => {
      const value = formatAxisDate(x);
      const coord = this.plotter.toCurrentScreenX(x);

      const [xmin, xmax] = this.plotter.screen.x;
      this.delta = nearestPow(
        Math.ceil((this.x.length * initialDistance) / (xmax - xmin))
      );

      const $label = createElement('div', {
        classes: `label ${index % this.delta === 0 ? '' : 'hidden'}`,
        style: {
          left: `${coord - labelWidth / 2}px`,
          width: `${labelWidth}px`,
        },
      });

      $label.innerText = value;
      $label.value = x;

      this.$labels.push($label);
      this.$element.appendChild($label);
    });
  }

  renderShadows() {
    const leftShadow = createElement('div', { classes: 'shadow left' });
    const rightShadow = createElement('div', { classes: 'shadow right' });

    this.$element.appendChild(leftShadow);
    this.$element.appendChild(rightShadow);
  }

  update() {
    const [xmin, xmax] = this.plotter.domain.x;
    const delta = nearestPow(
      Math.floor(
        (this.x.length * initialDistance) /
          (this.plotter.toCurrentScreenX(xmax) -
            this.plotter.toCurrentScreenX(xmin))
      )
    );

    if (delta >= 1) {
      if (delta < this.delta) {
        this.delta = this.delta / 2;
      } else if (delta > this.delta) {
        this.delta = this.delta * 2;
      }
    }

    this.$labels.forEach(($label, index) => {
      const coord = this.plotter.toCurrentScreenX($label.value);
      $label.style['left'] = `${coord - labelWidth / 2}px`;

      $label.classList.toggle('hidden', index % this.delta !== 0);
    });
  }
}

export default XAxis;
