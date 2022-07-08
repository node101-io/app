window.addEventListener('load', event => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('guide-image')) {
      const url = event.target.style.backgroundImage.replace('url(', '').replace(')', '').replaceAll('"', '');
      window.open(url, '_blank');
    }

    if (event.target.classList.contains('guide-code')) {
      const range = document.createRange();
      range.selectNodeContents(event.target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      event.target.classList.remove('guide-code');
      event.target.classList.add('guide-code-copied')
      setTimeout(() => {
        event.target.classList.remove('guide-code-copied')
        event.target.classList.add('guide-code');
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
