import { createElement, objectForEach } from './utils';

class Filter {
  constructor({ graphs, onFilterToggle }) {
    this.graphs = graphs;
    this.onFilterToggle = onFilterToggle;
  }

  appendTo($container) {
    this.$container = $container;
    this.render();
  }

  render() {
    objectForEach(this.graphs, (key, graph) => {
      const $button = createElement('div', {
        classes: 'filter-button checked',
      });
      const $name = createElement('span', { classes: 'filter-name' });
      const $circle = createElement('div', {
        classes: 'filter-circle',
        style: { 'border-color': graph.color },
      });

      $button.addEventListener('click', () => {
        $button.classList.toggle('checked');
        this.onFilterToggle(key, !graph.visible);
      });

      $name.innerText = graph.name;

      $button.appendChild($circle);
      $button.appendChild($name);

      this.$container.appendChild($button);
    });
  }
}

export default Filter;
