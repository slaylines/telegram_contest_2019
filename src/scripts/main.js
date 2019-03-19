import Chart from './chart';

document.addEventListener('DOMContentLoaded', () => {
  const $container = document.querySelector('main');

  window.data.forEach((data, index) => {
    const chart = new Chart(`Chart ${index + 1}`, data);
    chart.appendTo($container);
  });
});
