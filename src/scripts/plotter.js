import {
  min,
  max,
  closestLeftIndexOf,
  closestRightIndexOf,
  objectFilter,
} from './utils';

class Plotter {
  constructor({ $container, x, graphs }) {
    this.width = $container.clientWidth;
    this.height = $container.clientHeight;

    this.x = x;
    this.graphs = graphs;

    this.screen = {
      x: [0, this.width],
      y: [0, this.height],
    };

    this.domain = this.domainFromRange(min(x), max(x));
    this.range = Object.assign({}, this.domain);
  }

  domainFromRange(a, b) {
    const graphs = objectFilter(this.graphs, (key, graph) => graph.visible);
    const imin = closestLeftIndexOf(this.x, a);
    const imax = closestRightIndexOf(this.x, b);
    const ymax = max(
      Object.values(graphs).map(({ values }) =>
        max(values.slice(imin, imax + 1))
      )
    );

    return {
      x: [a, b],
      y: [0, ymax],
    };
  }

  toScreenX(v) {
    const dx = this.domain.x;
    const sx = this.screen.x;

    return sx[0] + ((v - dx[0]) / (dx[1] - dx[0])) * (sx[1] - sx[0]);
  }

  toScreenY(v) {
    const dy = this.domain.y;
    const sy = this.screen.y;

    return sy[1] - sy[0] - ((v - dy[0]) / (dy[1] - dy[0])) * (sy[1] - sy[0]);
  }

  toScreen(d) {
    return {
      x: [this.toScreenX(d.x[0]), this.toScreenX(d.x[1])],
      y: [this.toScreenY(d.y[1]), this.toScreenY(d.y[0])],
    };
  }

  viewBoxFromScreen(s = this.screen) {
    return `${s.x[0]} ${s.y[0]} ${s.x[1] - s.x[0]} ${s.y[1] - s.y[0]}`;
  }

  viewBoxFromRange(a, b) {
    const d = this.domainFromRange(a, b);
    const s = this.toScreen(d);

    return this.viewBoxFromScreen(s);
  }

  getPathLine(key) {
    return this.x.reduce((result, value, index) => {
      const x = this.toScreenX(value);
      const y = this.toScreenY(this.graphs[key].values[index]);

      return index === 0 ? `M${x} ${y}` : `${result} L ${x} ${y}`;
    }, '');
  }
}

export default Plotter;
