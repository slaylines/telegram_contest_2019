import chartData from '../data/charts.json';
import Chart from './chart';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('main');

  chartData.forEach(data => {
    const chart = new Chart(data);
    const element = chart.render();

    container.appendChild(element);
  });
});
