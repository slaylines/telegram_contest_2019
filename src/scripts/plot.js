import PlotBase from './plot-base';

class Plot extends PlotBase {
  updateViewport(screen) {
    const viewBox = this.plotter.viewBoxFromRange(
      this.plotter.toDomainX(screen[0]),
      this.plotter.toDomainX(screen[1])
    );

    this.$element.setAttribute('viewBox', viewBox);
  }
}

export default Plot;
