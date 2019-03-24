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
    this.width = width;
    this.height = height;

    this.x = x;
    this.graphs = graphs;

    this.left = 0;
    this.right = 1;
    this.domain = this.domainFromRatios();
    this.current = Object.assign({}, this.domain);

    this.$svg.setAttribute('width', width);
    this.$svg.setAttribute('height', height);
    this.$svg.setAttribute('viewBox', this.viewBoxFromScreen());
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

  toScreenX(v, isCurrent = false) {
    const dx = (isCurrent ? this.current : this.domain).x;
    const sx = this.screen.x;

    return sx[0] + ((v - dx[0]) / (dx[1] - dx[0])) * (sx[1] - sx[0]);
  }

  toScreenY(v, isCurrent = false) {
    const dy = (isCurrent ? this.current : this.domain).y;
    const sy = this.screen.y;

    return sy[1] - sy[0] - ((v - dy[0]) / (dy[1] - dy[0])) * (sy[1] - sy[0]);
  }

  toScreen(d) {
    return {
      x: [this.toScreenX(d.x[0]), this.toScreenX(d.x[1])],
      y: [this.toScreenY(d.y[1]), this.toScreenY(d.y[0])],
    };
  }

  toDomainX(v, isCurrent = false) {
    const dx = (isCurrent ? this.current : this.domain).x;
    const sx = this.screen.x;

    return dx[0] + ((v - sx[0]) / (sx[1] - sx[0])) * (dx[1] - dx[0]);
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

  domainFromRatios() {
    const imin = leftIndexFromRatio(this.x, this.left);
    const imax = rightIndexFromRatio(this.x, this.right);

    const xgmin = this.x[0];
    const xgmax = this.x[this.x.length - 1];

    const xmin = xgmin + (xgmax - xgmin) * this.left;
    const xmax = xgmin + (xgmax - xgmin) * this.right;
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
    this.current = this.domainFromRatios();
  }
}

export default Plotter;
