export const animateViewBox = ({ $svg, from, to, duration, callback }) => {
  let start;

  const [xminFrom, yminFrom, xmaxFrom, ymaxFrom] = from;
  const [xminTo, yminTo, xmaxTo, ymaxTo] = to;

  const xminDelta = xminTo - xminFrom;
  const yminDelta = yminTo - yminFrom;
  const xmaxDelta = xmaxTo - xmaxFrom;
  const ymaxDelta = ymaxTo - ymaxFrom;

  const animateStep = now => {
    if (!start) start = now;

    const progress = Math.min((now - start) / duration, 1);

    const xmin = xminFrom + xminDelta * progress;
    const ymin = yminFrom + yminDelta * progress;
    const xmax = xmaxFrom + xmaxDelta * progress;
    const ymax = ymaxFrom + ymaxDelta * progress;

    $svg.setAttribute('viewBox', `${xmin} ${ymin} ${xmax} ${ymax}`);

    if (progress < 1) {
      $svg.animation = requestAnimationFrame(animateStep);
    } else if (callback) {
      callback();
    }
  };

  cancelAnimationFrame($svg.animation);

  $svg.animation = requestAnimationFrame(animateStep);
};
