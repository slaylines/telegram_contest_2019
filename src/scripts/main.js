import chartData from '../data/charts.json';
import Chart from './chart';
import simpleData from '../data/simple.json';
import { objectForEach } from './utils';

const getPosition = (domain, range, value) =>
  domain[0] +
  ((value - range[0]) / (range[1] - range[0])) * (domain[1] - domain[0]);

const getXPosition = (value, xRange, width) =>
  getPosition([0, width], xRange, value);

const getYPosition = (value, yRange, height) =>
  height - getPosition([0, height], yRange, value);

const createSvgElement = (tag, options = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  objectForEach(options || {}, (key, value) =>
    element.setAttribute(key, value)
  );
  return element;
};

const getPathLine = (xValues, yValues, xRange, yRange, width, height) =>
  xValues.reduce((res, val, index) => {
    const x = getXPosition(val, xRange, width);
    const y = getYPosition(yValues[index], yRange, height);

    return index === 0 ? `M${x} ${y}` : `${res} L ${x} ${y}`;
  }, '');

const min = array => Math.min.apply(null, array);
const max = array => Math.max.apply(null, array);

const fps = 30;

const animateViewBox = ($svg, viewBox, newViewBox, duration, callback) => {
  let step = 1;
  const steps = (duration / 1000) * fps;

  const [xminFrom, yminFrom, xmaxFrom, ymaxFrom] = viewBox;
  const [xminTo, yminTo, xmaxTo, ymaxTo] = newViewBox;

  const xminStep = (xminTo - xminFrom) / steps;
  const yminStep = (yminTo - yminFrom) / steps;
  const xmaxStep = (xmaxTo - xmaxFrom) / steps;
  const ymaxStep = (ymaxTo - ymaxFrom) / steps;

  const animateStep = () => {
    if (step < steps) {
      step += 1;

      const xmin = xminFrom + xminStep * step;
      const ymin = yminFrom + yminStep * step;
      const xmax = xmaxFrom + xmaxStep * step;
      const ymax = ymaxFrom + ymaxStep * step;

      $svg.setAttribute('viewBox', `${xmin} ${ymin} ${xmax} ${ymax}`);

      requestAnimationFrame(animateStep);
    } else {
      callback();
    }
  };

  requestAnimationFrame(animateStep);
};

document.addEventListener('DOMContentLoaded', () => {
  const data = simpleData;

  const $container = document.querySelector('main');

  const $xmin = document.querySelector('#xmin');
  const $ymin = document.querySelector('#ymin');
  const $xmax = document.querySelector('#xmax');
  const $ymax = document.querySelector('#ymax');
  const $duration = document.querySelector('#duration');
  const $start = document.querySelector('#start');

  const width = $container.clientWidth;
  const height = $container.clientHeight;

  let xmin = +$xmin.value;
  let ymin = +$ymin.value;
  let xmax = +$xmax.value;
  let ymax = +$ymax.value;

  const d0 = getPathLine(
    data.x,
    data.y0,
    [min(data.x), max(data.x)],
    [min(data.y0), max(data.y0)],
    width,
    height
  );

  const d1 = getPathLine(
    data.x,
    data.y1,
    [min(data.x), max(data.x)],
    [min(data.y1), max(data.y1)],
    width,
    height
  );

  // chartData.forEach(data => {
  //   const chart = new Chart(data);
  //   const element = chart.render();

  //   container.appendChild(element);
  // });

  const $svg = createSvgElement('svg', {
    width,
    height,
    viewBox: [xmin, ymin, xmax, ymax].join(' '),
    preserveAspectRatio: 'none',
  });

  const $graphics = createSvgElement('g');

  const $path0 = createSvgElement('path', {
    d: d0,
    stroke: 'red',
    fill: 'none',
    'vector-effect': 'non-scaling-stroke',
  });

  const $path1 = createSvgElement('path', {
    d: d1,
    stroke: 'blue',
    fill: 'none',
    'vector-effect': 'non-scaling-stroke',
  });

  $graphics.appendChild($path0);
  $graphics.appendChild($path1);

  $svg.appendChild($graphics);
  $container.appendChild($svg);

  $start.addEventListener('click', () => {
    const viewBox = [xmin, ymin, xmax, ymax];
    const newViewBox = [+$xmin.value, +$ymin.value, +$xmax.value, +$ymax.value];
    const duration = +$duration.value;

    $path0.classList.add('hidden');

    animateViewBox($svg, viewBox, newViewBox, duration, () => {
      [xmin, ymin, xmax, ymax] = newViewBox;
    });
  });

  setTimeout(() => {
    const viewBox = [xmin, ymin, xmax, ymax];
    const newViewBox = [100, 0, 600, 300];
    const duration = 1000;

    animateViewBox($svg, viewBox, newViewBox, duration, () => {
      [xmin, ymin, xmax, ymax] = newViewBox;
    });
  }, 0);

  setTimeout(() => {
    const viewBox = [xmin, ymin, xmax, ymax];
    const newViewBox = [100, 100, 600, 200];
    const duration = 1000;

    animateViewBox($svg, viewBox, newViewBox, duration, () => {
      [xmin, ymin, xmax, ymax] = newViewBox;
    });
  }, 1000);

  setTimeout(() => {
    const viewBox = [xmin, ymin, xmax, ymax];
    const newViewBox = [0, 0, 600, 300];
    const duration = 1000;

    animateViewBox($svg, viewBox, newViewBox, duration, () => {
      [xmin, ymin, xmax, ymax] = newViewBox;
    });
  }, 2000);
});
