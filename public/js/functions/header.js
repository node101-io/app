const alphaNumeric = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

let searchFunctionCallCount = 0;

function isSimilarStrings(str1, str2) {
  const str1Parts = str1.split(' ').map(each => each.trim().toLowerCase()).filter(each => each.length);
  const str2Parts = str2.split(' ').map(each => each.trim().toLowerCase()).filter(each => each.length);

  if (str1Parts.find(each => str2.trim().toLowerCase().includes(each)))
    return true;

  if (str2Parts.find(each => str1.trim().toLowerCase().includes(each)))
    return true;

  return false;
}

function createSearchProject(project) {
  const searchProject = document.createElement('div');
  searchProject.classList.add('each-all-header-search-result');

  const searchProjectImage = document.createElement('div');
  searchProjectImage.style.backgroundImage = `url(${project.image})`;
  searchProjectImage.classList.add('each-all-header-search-result-image');
  searchProject.appendChild(searchProjectImage);

  const searchProjectName = document.createElement('div');
  searchProjectName.innerHTML = project.name;
  searchProjectName.classList.add('each-all-header-search-result-name');
  searchProject.appendChild(searchProjectName);

  document.querySelector('.all-header-search-results-wrapper').appendChild(searchProject);
}

function loadSearchProjects(query, count) {
  if (count != searchFunctionCallCount)
    return;

  if (!isUploadingFinished)
    setTimeout(() => {
      loadSearchProjects(query, count);
    }, 2000);

  const searchProjects = document.querySelectorAll('.each-all-header-search-result');

  for (let i = 0; i < searchProjects.length; i++)
    if (!query.length || isSimilarStrings(query, searchProjects[i].childNodes[1].innerHTML))
      searchProjects[i].style.display = 'flex';
    else
      searchProjects[i].style.display = 'none';
}

window.addEventListener('load', () => {
  document.querySelector('.all-wrapper').addEventListener('scroll', event => {
    document.querySelector('.all-header-wrapper').style.borderBottomColor = `rgba(236, 236, 236, ${Math.min(event.target.scrollTop, window.innerHeight) / window.innerHeight})`;
    document.querySelector('.all-header-wrapper').style.boxShadow = `0 0 10px rgba(236, 236, 236, ${Math.min(event.target.scrollTop, window.innerHeight) / window.innerHeight})`;
  });

  const searchInput = document.getElementById('all-header-search-input');

  document.addEventListener('keyup', event => {
    if (document.activeElement.id != 'all-header-search-input') {
      searchInput.focus();
      document.querySelector('.all-header-search-wrapper').style.overflow = 'visible';
      if (alphaNumeric.includes(event.key))
        searchInput.value += event.key;
    }
  });

  searchInput.addEventListener('input', event => {
    document.querySelector('.all-header-search-wrapper').style.overflow = 'visible';

    searchFunctionCallCount += 1;
    loadSearchProjects(event.target.value, searchFunctionCallCount);
  });

  document.addEventListener('focusout', event => {
    if (event.target.id == 'all-header-search-input') {
      document.querySelector('.all-header-search-wrapper').style.overflow = 'hidden';
    }
  })
});
