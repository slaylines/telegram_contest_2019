const FPS = 20;

export const animateViewBox = ({ $svg, from, to, duration, callback }) => {
  let step = 1;
  const steps = (duration / 1000) * FPS;

  const [xminFrom, yminFrom, xmaxFrom, ymaxFrom] = from;
  const [xminTo, yminTo, xmaxTo, ymaxTo] = to;

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
    } else if (callback) {
      callback();
    }
  };

  requestAnimationFrame(animateStep);
};
