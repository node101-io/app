let language = null;
let pageLanguage = null;

window.addEventListener('load', () => {
  if (document.getElementById('language'))
    language = document.getElementById('language').value;
  if (document.getElementById('page-language'))
    pageLanguage = document.getElementById('language').value;

  document.querySelector('.all-wrapper').addEventListener('scroll', event => {
    document.querySelector('.all-header-wrapper').style.borderBottomColor = `rgba(236, 236, 236, ${Math.min(event.target.scrollTop, window.innerHeight) / window.innerHeight})`;
    document.querySelector('.all-header-wrapper').style.boxShadow = `0 0 10px rgba(236, 236, 236, ${Math.min(event.target.scrollTop, window.innerHeight) / window.innerHeight})`;
  });
});
