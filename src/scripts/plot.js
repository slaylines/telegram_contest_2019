import PlotBase from './plot-base';
import YAxis from './yaxis';
import Legend from './legend';

class Plot extends PlotBase {
  render() {
    super.render();

    this.yaxis = new YAxis({
      x: this.x,
      graphs: this.graphs,
      plotter: this.plotter,
    });

    this.legend = new Legend({
      x: this.x,
      graphs: this.graphs,
      plotter: this.plotter,
    });

    this.yaxis.appendTo(this.$container);
    this.legend.appendTo(this.$container);
  }

  update() {
    super.update();

    this.yaxis.update();
  }

  updateViewport(screen) {
    const viewBox = this.plotter.viewBoxFromRange(
      this.plotter.toDomainX(screen[0]),
      this.plotter.toDomainX(screen[1])
    );

    this.$element.setAttribute('viewBox', viewBox);
  }
}

export default Plot;
