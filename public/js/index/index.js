window.addEventListener('load', () => {
  document.querySelector('.all-wrapper').addEventListener('scroll', event => {
    document.querySelector('.learn-more-button').style.opacity = 1 - Math.min(event.target.scrollTop, 80) / 80;
    if (event.target.scrollTop >= 80)
      document.querySelector('.learn-more-button').style.display = 'none';
    else
      document.querySelector('.learn-more-button').style.display = 'flex';
  });
});
