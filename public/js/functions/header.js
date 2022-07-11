const alphaNumeric = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

let isSearchMenuOpen = false;
let searchFunctionCallCount = 0;
let highlightedSearchResult = null;
let highlightedSearchResultArrowLocation = -1;

function isSimilarStrings(str1, str2) {
  str1 = str1.trim().toLowerCase().split(' ').join('').split('\t').join('').split('\n').join('').split('-').join('');
  str2 = str2.trim().toLowerCase().split(' ').join('').split('\t').join('').split('\n').join('').split('-').join('');

  if (str1.includes(str2) || str2.includes(str1))
    return true;

  return false;
}

function createSearchProject(project) {
  const searchProject = document.createElement('div');
  searchProject.classList.add('each-all-header-search-result');
  searchProject.id = 'search-project-' + project._id;

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
  let isFirstToShow = true;

  for (let i = 0; i < searchProjects.length; i++)
    if (!query.length || isSimilarStrings(query, searchProjects[i].childNodes[1].innerHTML)) {
      searchProjects[i].style.display = 'flex';
      if (!query.length) {
        if (highlightedSearchResult) {
          highlightedSearchResult.classList.remove('each-all-header-search-result-highlighted');
          highlightedSearchResult = null;
          highlightedSearchResultArrowLocation = -1;
        }
      } else if (isFirstToShow) {
        isFirstToShow = false;
        if (highlightedSearchResult)
          highlightedSearchResult.classList.remove('each-all-header-search-result-highlighted');
        highlightedSearchResult = searchProjects[i];
        highlightedSearchResult.classList.add('each-all-header-search-result-highlighted');
        highlightedSearchResultArrowLocation = 0;
      }
    } else {
      searchProjects[i].style.display = 'none';
    }
}

window.addEventListener('load', () => {
  document.querySelector('.all-wrapper').addEventListener('scroll', event => {
    document.querySelector('.all-header-wrapper').style.borderBottomColor = `rgba(236, 236, 236, ${Math.min(event.target.scrollTop, window.innerHeight) / window.innerHeight})`;
    document.querySelector('.all-header-wrapper').style.boxShadow = `0 0 10px rgba(236, 236, 236, ${Math.min(event.target.scrollTop, window.innerHeight) / window.innerHeight})`;
  });

  const searchInput = document.getElementById('all-header-search-input');

  document.addEventListener('keyup', event => {
    if (document.activeElement.id != 'all-header-search-input') {
      isSearchMenuOpen = true;
      searchInput.focus();
      document.querySelector('.all-header-search-wrapper').style.overflow = 'visible';
      if (alphaNumeric.includes(event.key))
        searchInput.value += event.key;
      if ((event.key == 'Backspace' || event.key == 'Delete') && searchInput.value && searchInput.value.length)
        searchInput.value = searchInput.value.substring(0, searchInput.value.length-1);
      searchFunctionCallCount += 1;
      loadSearchProjects(searchInput.value, searchFunctionCallCount);
    }
    
    if (event.target.id == 'all-header-search-input' && event.key == 'Enter' && highlightedSearchResult) {
      const project_id = highlightedSearchResult.id.replace('search-project-', '');
      window.location = '/projects/guide?id=' + project_id; 
    }

    if (event.target.id == 'all-header-search-input' && event.key == 'ArrowUp') {
      event.preventDefault();

      if (highlightedSearchResultArrowLocation > 0 && highlightedSearchResult && highlightedSearchResult.previousElementSibling) {
        let currentElement = highlightedSearchResult.previousElementSibling;

        while (currentElement) {
          if (currentElement.style.display == 'flex') {
            highlightedSearchResult.classList.remove('each-all-header-search-result-highlighted');
            highlightedSearchResultArrowLocation--;
            highlightedSearchResult = currentElement;
            highlightedSearchResult.classList.add('each-all-header-search-result-highlighted');
            break;
          }
  
          if (currentElement.previousElementSibling) {
            currentElement = currentElement.previousElementSibling;
          } else {
            currentElement = null;
          }
        } 
      }
    }

    if (event.target.id == 'all-header-search-input' && event.key == 'ArrowDown') {
      event.preventDefault();

      if (highlightedSearchResult && highlightedSearchResult.nextElementSibling) {
        let currentElement = highlightedSearchResult.nextElementSibling;

        while (currentElement) {
          if (currentElement.style.display == 'flex') {
            highlightedSearchResult.classList.remove('each-all-header-search-result-highlighted');
            highlightedSearchResultArrowLocation++;
            highlightedSearchResult = currentElement;
            highlightedSearchResult.classList.add('each-all-header-search-result-highlighted');
            break;
          }
  
          if (currentElement.nextElementSibling) {
            currentElement = currentElement.nextElementSibling;
          } else {
            currentElement = null;
          }
        }
      }
    }
  });

  searchInput.addEventListener('input', event => {
    if (event.target.id == 'all-header-search-input') {
      document.querySelector('.all-header-search-wrapper').style.overflow = 'visible';

      searchFunctionCallCount += 1;
      loadSearchProjects(event.target.value, searchFunctionCallCount);
    }
  });

  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-all-header-search-result') || (event.target.parentNode && event.target.parentNode.classList.contains('each-all-header-search-result'))) {
      const target = event.target.classList.contains('each-all-header-search-result') ? event.target : event.target.parentNode;
      const project_id = target.id.replace('search-project-', '');
      window.location = '/projects/guide?id=' + project_id; 
    } else if (event.target.classList.contains('all-header-search-wrapper') || (event.target.parentNode && (event.target.parentNode.classList.contains('all-header-search-wrapper') || (event.target.parentNode.parentNode && (event.target.parentNode.parentNode.classList.contains('all-header-search-wrapper') || (event.target.parentNode.parentNode.parentNode && event.target.parentNode.parentNode.parentNode.classList.contains('all-header-search-wrapper'))))))) {
      searchInput.focus();
      isSearchMenuOpen = true;
      document.querySelector('.all-header-search-wrapper').style.overflow = 'visible';
    } else {
      isSearchMenuOpen = false;
      document.querySelector('.all-header-search-wrapper').style.overflow = 'hidden';
    }
  });
});
