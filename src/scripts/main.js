import Chart from './chart';

document.addEventListener('DOMContentLoaded', () => {
  const $container = document.querySelector('main');
  const $footer = document.querySelector('footer');

  window.data.forEach((data, index) => {
    const chart = new Chart(`Chart ${index + 1}`, data);
    chart.appendTo($container);
  });

  $footer.addEventListener('click', () => {
    document.body.classList.toggle('day');
    document.body.classList.toggle('night');
  });
});
