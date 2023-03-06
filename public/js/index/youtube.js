window.onload = function() {
  const id = JSON.parse(document.getElementById('id').value);

  var desktopFallback = `https://youtu.be/${id}`,
  mobileFallback = `https://youtu.be/${id}`,
  app = `vnd.youtube://${id}`;

  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location = app;
    window.setTimeout(function() {
        window.location = mobileFallback;
    }, 25);
  }
  else {
    window.location = desktopFallback;
  }

  function killPopup() {
    window.removeEventListener('pagehide', killPopup);
  }

  window.addEventListener('pagehide', killPopup);
};