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

  updateViewport(left, right) {
    this.plotter.setRatios(left, right);
    this.$element.setAttribute('viewBox', this.plotter.viewBoxFromRatios());
    this.yaxis.update();
  }
}

export default Plot;
