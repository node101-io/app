const PROJECT_LIMIT_PER_QUERY = 20;

const statusColors = {
  active: 'rgb(57, 129, 29)',
  upcoming: 'rgb(130, 170, 235)',
  ended: 'rgb(255, 22, 3)'
};
const languageColors = {
  en: 'rgb(57, 129, 29)',
  tr: 'rgb(130, 170, 235)',
  ru: 'rgb(255, 22, 3)'
};
const popularityColors = {
  high: 'rgb(57, 129, 29)',
  medium: 'rgb(255, 215, 0)',
  low: 'rgb(255, 22, 3)'
};

let language = null;
let isUploadFistCall = true;
let isUploadingFinished = false;
let projects = [];
let projectIds = [];

function uploadProjects() {
  if (isUploadingFinished)
    return;

  serverRequest('/projects/filter', 'POST', {
    language,
    limit: PROJECT_LIMIT_PER_QUERY,
    nin_id_list: projectIds,
    is_active: true
  }, res => {
    if (!res.success) {
      if (isUploadFistCall && document.querySelector('.projects-wrapper'))
        document.querySelector('.projects-wrapper').innerHTML = 'Upload Error. Please try again later.';
      isUploadingFinished = true;

      return createConfirm({
        title: 'An unexpected error occured',
        text: 'An unexpected error occured while loading the projects. Please try again later or contact our team. Thank you for your understanding.',
        accept: 'Close'
      }, res => { return; });
    }

    if (isUploadFistCall) {
      isUploadFistCall = false;

      if (document.querySelector('.projects-wrapper')) {
        if (res.projects && res.projects.length) {
          document.querySelector('.projects-wrapper').style.alingItems = 'initial';
          document.querySelector('.projects-wrapper').style.justifyContent = 'initial';
          document.querySelector('.projects-wrapper').innerHTML = '';
        } else {
          document.querySelector('.projects-wrapper').innerHTML = 'No projects found.';
        }
      }
    }

    for (let i = 0; i < res.projects.length; i++) {
      projects.push(res.projects[i]);
      projectIds.push(res.projects[i]._id.toString());

      if (typeof createProject == 'function')
        createProject(res.projects[i]);
      if (typeof createSearchProject == 'function')
        createSearchProject(res.projects[i]);
    }

    if (res.projects && res.projects.length)
      uploadProjects();
    else
      isUploadingFinished  = true;
  });
}

window.addEventListener('load', () => {
  if (document.getElementById('language'))
    language = document.getElementById('language').value;
  uploadProjects();
});
