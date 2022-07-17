let project;

function uploadIcons() {
  Object.keys(project.links).forEach(key => {
    if (project.links[key] && project.links[key].length) {
      const projectLink = document.createElement('a');
      projectLink.classList.add('each-project-link');
      projectLink.href = project.links[key];
      projectLink.target = '_blank';

      const icon = getProjectLinkIconDOM(key);
      projectLink.appendChild(icon);

      document.querySelector('.project-links-wrapper').appendChild(projectLink);
    }
  });
}

window.addEventListener('load', () => {
  project = JSON.parse(document.getElementById('project-json').value);
  uploadIcons();

  document.addEventListener('click', event => {
    if (event.target.classList.contains('guide-image')) {
      const url = event.target.style.backgroundImage.replace('url(', '').replace(')', '').replaceAll('"', '');
      window.open(url, '_blank');
    }

    if (ancestorWithClassName(event.target, 'guide-code')) {
      const target = ancestorWithClassName(event.target, 'guide-code');

      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      target.classList.remove('guide-code');
      target.classList.add('guide-code-copied')
      setTimeout(() => {
        target.classList.remove('guide-code-copied')
        target.classList.add('guide-code');
        if (window.getSelection) {
          if (window.getSelection().empty) {
            window.getSelection().empty();
          } else if (window.getSelection().removeAllRanges) {
            window.getSelection().removeAllRanges();
          }
        } else if (document.selection) {
          document.selection.empty();
        }
      }, 1500);
    }
  })
});
