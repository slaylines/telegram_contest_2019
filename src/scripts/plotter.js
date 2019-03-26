import { max, leftIndexFromRatio, rightIndexFromRatio } from './utils';

const graphsMax = (graphs, imin, imax) =>
  max(
    Object.values(graphs).map(({ values, visible }) =>
      visible ? max(values.slice(imin, imax)) : Number.MIN_SAFE_INTEGER
    )
  );

class Plotter {
  constructor({ $svg, width, height, x, graphs }) {
    this.$svg = $svg;

    this.x = x;
    this.graphs = graphs;

    this.resize(width, height);
  }

  get screen() {
    return {
      x: [0, this.width],
      y: [0, this.height],
    };
  }

  /**
   * Conversion between coordinate systems.
   */

  toScreenX(v, domain = this.domain) {
    const dx = domain.x;
    const sx = this.screen.x;

    return sx[0] + ((v - dx[0]) / (dx[1] - dx[0])) * (sx[1] - sx[0]);
  }

  toScreenY(v, domain = this.domain) {
    const dy = domain.y;
    const sy = this.screen.y;

    return sy[1] - sy[0] - ((v - dy[0]) / (dy[1] - dy[0])) * (sy[1] - sy[0]);
  }

  toCurrentScreenX(v) {
    return this.toScreenX(v, this.current);
  }
  toCurrentScreenY(v) {
    return this.toScreenY(v, this.current);
  }

  toPreviousScreenX(v) {
    return this.toScreenX(v, this.previous);
  }
  toPreviousScreenY(v) {
    return this.toScreenY(v, this.previous);
  }

  toScreen(d) {
    return {
      x: [this.toScreenX(d.x[0]), this.toScreenX(d.x[1])],
      y: [this.toScreenY(d.y[1]), this.toScreenY(d.y[0])],
    };
  }

  toDomainX(v, domain = this.domain) {
    const dx = domain.x;
    const sx = this.screen.x;

    return dx[0] + ((v - sx[0]) / (sx[1] - sx[0])) * (dx[1] - dx[0]);
  }

  toDomainY(v, domain = this.domain) {
    const dy = domain.y;
    const sy = this.screen.y;

    return dy[1] - dy[0] - ((v - sy[0]) / (sy[1] - sy[0])) * (dy[1] - dy[0]);
  }

  toCurrentDomainX(v) {
    return this.toDomainX(v, this.current);
  }
  toCurrentDomainY(v) {
    return this.toDomainY(v, this.current);
  }

  toPreviousDomainX(v) {
    return this.toDomainX(v, this.previous);
  }
  toPreviousDomainY(v) {
    return this.toDomainY(v, this.previous);
  }

  /**
   * For initial PlotBase rendering.
   */

  viewBoxFromScreen(s = this.screen) {
    return `${s.x[0]} ${s.y[0]} ${s.x[1] - s.x[0]} ${s.y[1] - s.y[0]}`;
  }

  getPathLine(key) {
    return this.x.reduce((result, value, index) => {
      const x = this.toScreenX(value);
      const y = this.toScreenY(this.graphs[key].values[index]);

      return index === 0 ? `M${x} ${y}` : `${result} L ${x} ${y}`;
    }, '');
  }

  /**
   * For getting viewBox for a given selection.
   */

  domainFromRatios(left = this.left, right = this.right) {
    const imin = leftIndexFromRatio(this.x, left);
    const imax = rightIndexFromRatio(this.x, right);

    const xgmin = this.x[0];
    const xgmax = this.x[this.x.length - 1];

    const xmin = xgmin + (xgmax - xgmin) * left;
    const xmax = xgmin + (xgmax - xgmin) * right;
    const ymin = 0;
    const ymax = graphsMax(this.graphs, imin, imax);

    return {
      x: [xmin, xmax],
      y: [ymin, ymax],
    };
  }

  viewBoxFromRatios() {
    const s = this.toScreen(this.current);

    return this.viewBoxFromScreen(s);
  }

  /**
   * Update methods.
   */

  setRatios(a, b) {
    this.left = a;
    this.right = b;
    this.updateDomain();
  }

  updateDomain() {
    this.previous = Object.assign({}, this.current);
    this.current = this.domainFromRatios();
  }

  resize(width, height) {
    this.left = 0;
    this.right = 1;

    this.width = width;
    this.height = height;

    this.domain = this.domainFromRatios();
    this.current = Object.assign({}, this.domain);
    this.previous = Object.assign({}, this.domain);

    this.$svg.setAttribute('width', width);
    this.$svg.setAttribute('height', height);
    this.$svg.setAttribute('viewBox', this.viewBoxFromScreen());
  }
}

export default Plotter;
