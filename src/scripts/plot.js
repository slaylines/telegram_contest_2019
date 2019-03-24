import PlotBase from './plot-base';
import XAxis from './xaxis';
import YAxis from './yaxis';
import Legend from './legend';

class Plot extends PlotBase {
  render() {
    super.render();

    this.xaxis = new XAxis({
      x: this.x,
      plotter: this.plotter,
    });

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
    this.xaxis.appendTo(this.$container);
  }

  updateXAxis() {
    this.xaxis.update();
  }

  updateYAxis(startDomain) {
    this.yaxis.update(startDomain);
  }

  update() {
    super.update();

    this.yaxis.update();
  }

  updateViewport(left, right) {
    this.plotter.setRatios(left, right);
    this.$element.setAttribute('viewBox', this.plotter.viewBoxFromRatios());
  }
}

export default Plot;
