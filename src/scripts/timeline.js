import PlotBase from './plot-base';
import { createSvgElement } from './utils';

const selectionLineSize = 8;

class Timeline extends PlotBase {
  constructor({ x, graphs, onUpdate }) {
    super({ x, graphs });
    this.onUpdate = onUpdate;
  }

  renderSelection() {
    const xMin = 0;
    const xMax = this.plotter.width;

    const graphics = createSvgElement('g', { classes: 'selection' });

    this.selection = {};

    // left selection bar
    this.selection.leftSelector = {};
    this.selection.leftSelector.value = xMin;
    this.selection.leftSelector.x = Math.max(xMin - selectionLineSize, 0);
    this.selection.leftSelector.width = selectionLineSize;
    this.selection.leftSelector.element = createSvgElement('rect', {
      classes: 'selector',
      x: this.selection.leftSelector.x,
      y: 0,
      width: this.selection.leftSelector.width,
      height: this.plotter.height,
    });
    graphics.appendChild(this.selection.leftSelector.element);

    // right selection bar
    this.selection.rightSelector = {};
    this.selection.rightSelector.value = xMax;
    this.selection.rightSelector.x = Math.min(
      xMax - selectionLineSize,
      this.plotter.width
    );
    this.selection.rightSelector.width = selectionLineSize;
    this.selection.rightSelector.element = createSvgElement('rect', {
      classes: 'selector',
      x: this.selection.rightSelector.x,
      y: 0,
      width: this.selection.rightSelector.width,
      height: this.plotter.height,
    });
    graphics.appendChild(this.selection.rightSelector.element);

    // border of selected area
    this.selection.areaSelector = {};
    this.selection.areaSelector.x =
      this.selection.leftSelector.x + this.selection.leftSelector.width + 1;
    this.selection.areaSelector.width =
      this.selection.rightSelector.x - this.selection.areaSelector.x - 1;
    this.selection.areaSelector.element = createSvgElement('rect', {
      classes: 'area',
      x: this.selection.areaSelector.x,
      y: 0,
      width: this.selection.areaSelector.width,
      height: this.plotter.height,
    });
    graphics.appendChild(this.selection.areaSelector.element);

    // left background rect for not selected area
    this.selection.leftBackground = {};
    this.selection.leftBackground.width = this.selection.leftSelector.x;
    this.selection.leftBackground.element = createSvgElement('rect', {
      classes: 'background',
      x: 0,
      y: 0,
      width: this.selection.leftBackground.width,
      height: this.plotter.height,
    });
    graphics.appendChild(this.selection.leftBackground.element);

    // right background rect for not selected area
    this.selection.rightBackground = {};
    this.selection.rightBackground.x =
      this.selection.rightSelector.x + this.selection.rightSelector.width;
    this.selection.rightBackground.width = Math.max(
      this.plotter.width - this.selection.rightBackground.x,
      0
    );
    this.selection.rightBackground.element = createSvgElement('rect', {
      classes: 'background',
      x: this.selection.rightBackground.x,
      y: 0,
      width: this.selection.rightBackground.width,
      height: this.plotter.height,
    });
    graphics.appendChild(this.selection.rightBackground.element);

    this.$container.addEventListener('mousemove', event => {
      this.onDrag(event);
    });
    document.addEventListener('mouseup', () => {
      this.dragArea = false;
      this.dragLeft = false;
      this.dragRight = false;
      this.onStopDrag();
    });

    this.selection.areaSelector.element.addEventListener('mousedown', event => {
      this.dragArea = true;
      this.onStartDrag(event);
    });
    this.selection.areaSelector.element.addEventListener('mouseup', () => {
      this.dragArea = false;
      this.onStopDrag();
    });

    this.selection.leftSelector.element.addEventListener('mousedown', event => {
      this.dragLeft = true;
      this.onStartDrag(event);
    });
    this.selection.leftSelector.element.addEventListener('mouseup', () => {
      this.dragLeft = false;
      this.onStopDrag();
    });

    this.selection.rightSelector.element.addEventListener(
      'mousedown',
      event => {
        this.dragRight = true;
        this.onStartDrag(event);
      }
    );
    this.selection.rightSelector.element.addEventListener('mouseup', () => {
      this.dragRight = false;
      this.onStopDrag();
    });

    this.$element.appendChild(graphics);
  }

  render() {
    super.render();
    this.renderSelection();
  }

  onStartDrag(event) {
    this.startMouseX = event.x;
    this.mouseX = event.x;
  }

  onStopDrag() {
    this.startMouseX = null;
    this.mouseX = null;
  }

  onDrag(event) {
    if (!this.dragArea && !this.dragLeft && !this.dragRight) {
      return;
    }

    let delta = event.x - this.mouseX;

    // TODO: minDiff - минимальный размер, должна быть длина 3х дней
    const minDiff = 30;

    if (this.dragArea) {
      if (delta > 0) {
        const right =
          this.selection.rightSelector.x +
          this.selection.rightSelector.width +
          delta;
        if (right > this.plotter.width) {
          delta =
            this.plotter.width -
            this.selection.rightSelector.x -
            this.selection.rightSelector.width;
        }
      }
      if (delta < 0) {
        const left = this.selection.leftSelector.x + delta;
        if (left < 0) {
          delta = -this.selection.leftSelector.x;
        }
      }

      this.selection.areaSelector.x += delta;
      this.selection.leftSelector.x += delta;
      this.selection.rightSelector.x += delta;
      this.selection.leftSelector.value += delta;
      this.selection.rightSelector.value += delta;

      this.selection.areaSelector.element.setAttribute(
        'x',
        this.selection.areaSelector.x
      );
      this.selection.leftSelector.element.setAttribute(
        'x',
        this.selection.leftSelector.x
      );
      this.selection.rightSelector.element.setAttribute(
        'x',
        this.selection.rightSelector.x
      );

      this.selection.leftBackground.width += delta;
      this.selection.rightBackground.x += delta;
      this.selection.rightBackground.width = Math.max(
        this.plotter.width - this.selection.rightBackground.x,
        0
      );

      this.selection.leftBackground.element.setAttribute(
        'width',
        this.selection.leftBackground.width
      );
      this.selection.rightBackground.element.setAttribute(
        'x',
        this.selection.rightBackground.x
      );
      this.selection.rightBackground.element.setAttribute(
        'width',
        this.selection.rightBackground.width
      );
    }

    if (this.dragLeft) {
      if (delta > 0) {
        const left =
          this.selection.leftSelector.x +
          this.selection.leftSelector.width +
          delta;
        if (left > this.selection.rightSelector.x - minDiff) {
          delta =
            this.selection.rightSelector.x -
            minDiff -
            this.selection.leftSelector.x -
            this.selection.leftSelector.width;
        }
      }
      if (delta < 0) {
        const left = this.selection.leftSelector.x + delta;
        if (left < 0) {
          delta = -this.selection.leftSelector.x;
        }
      }

      this.selection.leftSelector.x += delta;
      this.selection.leftSelector.value += delta;
      this.selection.areaSelector.x += delta;
      this.selection.areaSelector.width -= delta;

      this.selection.leftSelector.element.setAttribute(
        'x',
        this.selection.leftSelector.x
      );
      this.selection.areaSelector.element.setAttribute(
        'x',
        this.selection.areaSelector.x
      );
      this.selection.areaSelector.element.setAttribute(
        'width',
        this.selection.areaSelector.width
      );

      this.selection.leftBackground.width += delta;
      this.selection.leftBackground.element.setAttribute(
        'width',
        this.selection.leftBackground.width
      );
    }

    if (this.dragRight) {
      if (delta > 0) {
        const right =
          this.selection.rightSelector.x +
          this.selection.rightSelector.width +
          delta;
        if (right > this.plotter.width) {
          delta =
            this.plotter.width -
            this.selection.rightSelector.x -
            this.selection.rightSelector.width;
        }
      }
      if (delta < 0) {
        const right = this.selection.rightSelector.x + delta;
        if (
          right <
          this.selection.leftSelector.x +
            this.selection.leftSelector.width +
            minDiff
        ) {
          delta =
            this.selection.leftSelector.x +
            this.selection.leftSelector.width +
            minDiff -
            this.selection.rightSelector.x;
        }
      }

      this.selection.rightSelector.x += delta;
      this.selection.rightSelector.value += delta;
      this.selection.areaSelector.width += delta;

      this.selection.rightSelector.element.setAttribute(
        'x',
        this.selection.rightSelector.x
      );
      this.selection.areaSelector.element.setAttribute(
        'width',
        this.selection.areaSelector.width
      );

      this.selection.rightBackground.x += delta;
      this.selection.rightBackground.width -= delta;
      this.selection.rightBackground.element.setAttribute(
        'x',
        this.selection.rightBackground.x
      );
      this.selection.rightBackground.element.setAttribute(
        'width',
        this.selection.rightBackground.width
      );
    }

    this.mouseX = event.x;

    this.onUpdate([
      this.selection.leftSelector.value,
      this.selection.rightSelector.value,
    ]);
  }
}

export default Timeline;
