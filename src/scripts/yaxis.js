import { createElement } from './utils';

const numberOfLabels = 6;
const topMargin = 20;

class YAxis {
  constructor({ x, graphs, plotter }) {
    this.x = x;
    this.graphs = graphs;
    this.plotter = plotter;
  }

  appendTo($container) {
    this.$container = $container;
    this.render();
  }

  render() {
    this.$element = createElement('div', { classes: 'yaxis' });
    this.$labels = [];

    this.renderLabels();

    this.$container.appendChild(this.$element);
  }

  renderLabels() {
    const [ymin, ymax] = this.plotter.screen.y;
    const delta = ymax - topMargin - ymin;
    const step = delta / (numberOfLabels - 1);

    for (let index = 0; index < numberOfLabels; ++index) {
      const y = ymin + topMargin + index * step;
      const value = Math.round(this.plotter.toCurrentDomainY(y));

      const $label = createElement('div', {
        classes: 'label',
        style: { top: `${y}px` },
      });

      const $line = createElement('hr', { classes: 'label-line' });
      const $text = createElement('span', { classes: 'label-text' });

      $text.innerText = value;

      $label.appendChild($text);
      $label.appendChild($line);

      const $altLabel = $label.cloneNode(true);

      $altLabel.classList.add('hidden');

      $label.y = y;
      $label.$text = $label.querySelector('.label-text');

      $altLabel.y = y;
      $altLabel.$text = $altLabel.querySelector('.label-text');

      this.$labels.push($label);
      this.$labels.push($altLabel);

      this.$element.appendChild($label);
      this.$element.appendChild($altLabel);
    }
  }

  update(domain = this.plotter.previous) {
    if (
      domain.y[0] === this.plotter.current.y[0] &&
      domain.y[1] === this.plotter.current.y[1]
    ) {
      return;
    }

    this.$labels.forEach($label => {
      const hidden = $label.classList.contains('hidden');

      if (hidden) {
        const to = $label.y;
        const value = this.plotter.toCurrentDomainY(to);
        const from = this.plotter.toScreenY(value, domain);
        const text = Math.round(value);

        $label.$text.innerText = text;

        // TODO: Set initial position without animation.
        $label.style['transform'] = `translateY(${to - from}px)`;
        $label.classList.remove('hidden');
        $label.style['transform'] = 'translateY(0)';
      } else {
        const from = $label.y;
        const value = this.plotter.toDomainY(from, domain);
        const to = this.plotter.toCurrentScreenY(value);

        $label.classList.add('hidden');
        $label.style['transform'] = `translateY(${to - from}px)`;
      }
    });
  }
}

export default YAxis;
