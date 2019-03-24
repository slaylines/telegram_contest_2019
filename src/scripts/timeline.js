import PlotBase from './plot-base';
import { createElement, debounce } from './utils';

const barSize = 8;
const minDiff = 30;

class Timeline extends PlotBase {
  constructor({ x, graphs, onTimelineChange, onTimelineEnd }) {
    super({ x, graphs });

    this.onTimelineChange = onTimelineChange;
    this.onTimelineEnd = onTimelineEnd;
    this.onDrag = debounce(this.onDrag, this);
    this.onStopDrag = this.onStopDrag.bind(this);
    this.onStartDragLeft = this.onStartDrag('dragLeft').bind(this);
    this.onStartDragArea = this.onStartDrag('dragArea').bind(this);
    this.onStartDragRight = this.onStartDrag('dragRight').bind(this);
  }

  render() {
    super.render();
    this.renderSelection();
  }

  resize() {
    super.resize();

    this.updateLeftBar();
    this.updateRightBar();
    this.updateArea();
    this.updateLeftBackground();
    this.updateRightBackground();
  }

  renderSelection() {
    this.$selection = createElement('div', { classes: 'selection' });

    this.renderLeftBar();
    this.renderRightBar();
    this.renderArea();
    this.renderLeftBackground();
    this.renderRightBackground();

    this.$container.addEventListener('mousemove', this.onDrag);
    // this.$container.addEventListener('touchmove', this.onDrag);

    document.addEventListener('mouseup', this.onStopDrag);
    // document.addEventListener('touchend', this.onStopDrag);

    this.$container.appendChild(this.$selection);
  }

  renderLeftBar() {
    this.leftBar = { $element: createElement('div', { classes: 'selector' }) };
    this.$selection.appendChild(this.leftBar.$element);
    this.updateLeftBar();

    this.leftBar.$element.addEventListener('mousedown', this.onStartDragLeft);
    // this.leftBar.$element.addEventListener('touchstart', this.onStartDragLeft);
  }

  updateLeftBar() {
    const xmin = this.plotter.screen.x[0];

    Object.assign(this.leftBar, {
      value: xmin,
      x: Math.max(xmin - barSize, xmin),
      width: barSize,
    });

    Object.assign(this.leftBar.$element.style, {
      left: `${this.leftBar.x}px`,
      width: `${this.leftBar.width}px`,
    });
  }

  renderRightBar() {
    this.rightBar = { $element: createElement('div', { classes: 'selector' }) };
    this.$selection.appendChild(this.rightBar.$element);
    this.updateRightBar();

    this.rightBar.$element.addEventListener('mousedown', this.onStartDragRight);
    // this.rightBar.$element.addEventListener('touchstart', this.onStartDragRight);
  }

  updateRightBar() {
    const xmax = this.plotter.screen.x[1];

    Object.assign(this.rightBar, {
      value: xmax,
      x: Math.min(xmax - barSize, xmax),
      width: barSize,
    });

    Object.assign(this.rightBar.$element.style, {
      left: `${this.rightBar.x}px`,
      width: `${this.rightBar.width}px`,
    });
  }

  renderArea() {
    this.area = { $element: createElement('div', { classes: 'area' }) };
    this.$selection.appendChild(this.area.$element);
    this.updateArea();

    this.area.$element.addEventListener('mousedown', this.onStartDragArea);
    // this.area.$element.addEventListener('touchstart', this.onStartDragArea);
  }

  updateArea() {
    Object.assign(this.area, {
      x: this.leftBar.x + this.leftBar.width,
      width: this.rightBar.x - this.leftBar.x - this.leftBar.width,
    });

    Object.assign(this.area.$element.style, {
      left: `${this.area.x}px`,
      width: `${this.area.width}px`,
    });
  }

  renderLeftBackground() {
    this.leftBg = { $element: createElement('div', { classes: 'background' }) };
    this.$selection.appendChild(this.leftBg.$element);
    this.updateLeftBackground();
  }

  updateLeftBackground() {
    const xmin = this.plotter.screen.x[0];

    Object.assign(this.leftBg, {
      x: xmin,
      width: Math.min(this.leftBar.x - xmin, 0),
    });

    Object.assign(this.leftBg.$element.style, {
      left: `${this.leftBg.x}px`,
      width: `${this.leftBg.width}px`,
    });
  }

  renderRightBackground() {
    this.rightBg = {
      $element: createElement('div', { classes: 'background' }),
    };
    this.$selection.appendChild(this.rightBg.$element);
    this.updateRightBackground();
  }

  updateRightBackground() {
    const xmax = this.plotter.screen.x[1];

    Object.assign(this.rightBg, {
      x: this.rightBar.x + this.rightBar.width,
      width: Math.max(xmax - this.rightBar.x - this.rightBar.width, 0),
    });

    Object.assign(this.rightBg.$element.style, {
      left: `${this.rightBg.x}px`,
      width: `${this.rightBg.width}px`,
    });
  }

  onStartDrag(key) {
    return event => {
      this[key] = true;
      this.area.$element.classList.toggle('dragging', true);
      this.startDomain = Object.assign({}, this.plotter.previous);
      this.startMouseX = event.x;
      this.mouseX = event.x;
    };
  }

  onStopDrag() {
    if (!this.dragArea && !this.dragLeft && !this.dragRight) return;

    this.dragArea = false;
    this.dragLeft = false;
    this.dragRight = false;

    this.area.$element.classList.toggle('dragging', false);

    this.startMouseX = null;
    this.mouseX = null;

    this.onTimelineEnd(this.startDomain);
  }

  onDrag(event) {
    if (!this.dragArea && !this.dragLeft && !this.dragRight) {
      return;
    }

    if (this.dragArea) {
      this.onDragArea(event);
    }

    if (this.dragLeft) {
      this.onDragLeft(event);
    }

    if (this.dragRight) {
      this.onDragRight(event);
    }

    this.mouseX = event.x;

    this.onTimelineChange(
      this.leftBar.value / this.plotter.width,
      this.rightBar.value / this.plotter.width
    );
  }

  onDragArea(event) {
    const [xmin, xmax] = this.plotter.screen.x;
    let delta = event.x - this.mouseX;

    if (delta > 0) {
      const right = this.rightBar.x + this.rightBar.width + delta;

      if (right > xmax) {
        delta = xmax - this.rightBar.x - this.rightBar.width;
      }
    }

    if (delta < 0) {
      const left = this.leftBar.x + delta;

      if (left < xmin) {
        delta = -this.leftBar.x;
      }
    }

    this.area.x += delta;
    this.leftBar.x += delta;
    this.rightBar.x += delta;
    this.leftBar.value += delta;
    this.rightBar.value += delta;

    this.area.$element.style['left'] = `${this.area.x}px`;
    this.leftBar.$element.style['left'] = `${this.leftBar.x}px`;
    this.rightBar.$element.style['left'] = `${this.rightBar.x}px`;

    this.leftBg.width += delta;
    this.rightBg.x += delta;
    this.rightBg.width = Math.max(xmax - this.rightBg.x, 0);

    this.leftBg.$element.style['width'] = `${this.leftBg.width}px`;
    this.rightBg.$element.style['left'] = `${this.rightBg.x}px`;
    this.rightBg.$element.style['width'] = `${this.rightBg.width}px`;
  }

  onDragLeft(event) {
    let delta = event.x - this.mouseX;

    if (delta > 0) {
      const left = this.leftBar.x + this.leftBar.width + delta;

      if (left > this.rightBar.x - minDiff) {
        delta = this.rightBar.x - minDiff - this.leftBar.x - this.leftBar.width;
      }
    }

    if (delta < 0) {
      const left = this.leftBar.x + delta;
      if (left < 0) {
        delta = -this.leftBar.x;
      }
    }

    this.leftBar.x += delta;
    this.leftBar.value += delta;
    this.area.x += delta;
    this.area.width -= delta;

    this.leftBar.$element.style['left'] = `${this.leftBar.x}px`;
    this.area.$element.style['left'] = `${this.area.x}px`;
    this.area.$element.style['width'] = `${this.area.width}px`;

    this.leftBg.width += delta;
    this.leftBg.$element.style['width'] = `${this.leftBg.width}px`;
  }

  onDragRight(event) {
    let delta = event.x - this.mouseX;

    if (delta > 0) {
      const right = this.rightBar.x + this.rightBar.width + delta;

      if (right > this.plotter.width) {
        delta = this.plotter.width - this.rightBar.x - this.rightBar.width;
      }
    }

    if (delta < 0) {
      const right = this.rightBar.x + delta;

      if (right < this.leftBar.x + this.leftBar.width + minDiff) {
        delta = this.leftBar.x + this.leftBar.width + minDiff - this.rightBar.x;
      }
    }

    this.rightBar.x += delta;
    this.rightBar.value += delta;
    this.area.width += delta;

    this.rightBar.$element.style['left'] = `${this.rightBar.x}px`;
    this.area.$element.style['width'] = `${this.area.width}px`;

    this.rightBg.x += delta;
    this.rightBg.width -= delta;
    this.rightBg.$element.style['left'] = `${this.rightBg.x}px`;
    this.rightBg.$element.style['width'] = `${this.rightBg.width}px`;
  }
}

export default Timeline;
