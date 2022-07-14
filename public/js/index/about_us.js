window.addEventListener('load', () => {
  document.addEventListener('mouseover', event => {
    if (ancestorWithClassName(event.target, 'each-team-member-wrapper')) {
      const target = ancestorWithClassName(event.target, 'each-team-member-wrapper');

      if (target.classList.contains('each-team-member-wrapper-hovered'))
        return;

      if (document.querySelector('.each-team-member-wrapper-hovered'))
        document.querySelector('.each-team-member-wrapper-hovered').classList.remove('each-team-member-wrapper-hovered');

      target.classList.add('each-team-member-wrapper-hovered');
    } else if (document.querySelector('.each-team-member-wrapper-hovered')) {
      document.querySelector('.each-team-member-wrapper-hovered').classList.remove('each-team-member-wrapper-hovered');
    }
  })
});
