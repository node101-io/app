const TEN_SECOND_IN_MS = 10 * 1000;

let projectCount = 0;
let lastAnimationStartTime = 0;

function now() {
  return (new Date()).getTime();
}

function createProject(project) {
  if (projectCount >= 5)
    return;

  projectCount++;

  const projectWrapper = document.createElement('div');
  projectWrapper.classList.add('each-project-wrapper');

  const projectHeaderWrapper = document.createElement('div');
  projectHeaderWrapper.classList.add('each-project-header-wrapper');

  const projectLogo = document.createElement('div');
  projectLogo.classList.add('each-project-logo');
  projectLogo.style.backgroundImage = `url(${project.image})`;
  projectHeaderWrapper.appendChild(projectLogo);

  const projectName = document.createElement('div');
  projectName.classList.add('each-project-name')
  projectName.innerHTML = project.name;
  projectHeaderWrapper.appendChild(projectName);

  const projectInfoWrapper = document.createElement('div');
  projectInfoWrapper.classList.add('each-project-info-wrapper');

  const projectInfo1 = document.createElement('div');
  projectInfo1.classList.add('each-project-info');
  projectInfo1.classList.add('each-project-info-dates');
  projectInfo1.innerHTML = project.dates;
  projectInfoWrapper.appendChild(projectInfo1);

  const projectInfoSeperator1 = document.createElement('div');
  projectInfoSeperator1.classList.add('each-project-info-seperator');
  projectInfoSeperator1.classList.add('each-project-info-seperator-dates');
  projectInfoWrapper.appendChild(projectInfoSeperator1);

  const projectInfo2 = document.createElement('div');
  projectInfo2.classList.add('each-project-info');
  projectInfo2.style.color = 'var(--main-color)';
  projectInfo2.innerHTML = project.reward;
  projectInfoWrapper.appendChild(projectInfo2);

  const projectInfoSeperator2 = document.createElement('div');
  projectInfoSeperator2.classList.add('each-project-info-seperator');
  projectInfoWrapper.appendChild(projectInfoSeperator2);

  const projectInfo3 = document.createElement('div');
  projectInfo3.classList.add('each-project-info');
  projectInfo3.style.color = popularityColors[project.popularity];
  projectInfo3.innerHTML = project.popularity;
  projectInfoWrapper.appendChild(projectInfo3);

  projectHeaderWrapper.appendChild(projectInfoWrapper);

  projectWrapper.appendChild(projectHeaderWrapper);

  const projectContentWrapper = document.createElement('div');
  projectContentWrapper.classList.add('each-project-content-wrapper');

  const projectLinksWrapper = document.createElement('div');
  projectLinksWrapper.classList.add('each-project-links-wrapper');

  Object.keys(project.links).forEach(key => {
    if (project.links[key] && project.links[key].length) {
      const eachProjectLink = document.createElement('a');
      eachProjectLink.classList.add('each-project-link');
      eachProjectLink.href = project.links[key];
      eachProjectLink.target = '_blank';

      const icon = getProjectLinkIconDOM(key);
      eachProjectLink.appendChild(icon);

      projectLinksWrapper.appendChild(eachProjectLink);
    }
  });

  projectContentWrapper.appendChild(projectLinksWrapper);

  const projectDescription = document.createElement('div');
  projectDescription.classList.add('each-project-description');
  const descriptionParts = project.description.split('\n').join('<br/>').split(' ');
  for (let i = 0; i < descriptionParts.length; i++) {
    if (descriptionParts[i].includes('{')) {
      const a = document.createElement('a');
      a.innerHTML = descriptionParts[i].substring(0, descriptionParts[i].indexOf('{'));
      a.target = '_blank';
      a.href = descriptionParts[i].substring(descriptionParts[i].indexOf('{')+1, descriptionParts[i].indexOf('}'));
      projectDescription.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.innerHTML = (i > 0 && descriptionParts[i-1].includes('{') ? ' ' : '') + descriptionParts[i] + ' ';
      projectDescription.appendChild(span);
    }
  }
  projectContentWrapper.appendChild(projectDescription);

  const projectButtonsWrapper = document.createElement('div');
  projectButtonsWrapper.classList.add('each-project-buttons-wrapper');

  if (project.is_stakable) {
    const stakeButton = document.createElement('a');
    stakeButton.classList.add('each-project-button');
    stakeButton.classList.add('each-project-stake-button');
    stakeButton.href = project.stake_url;
    stakeButton.target = '_blank';
    stakeButton.innerHTML = 'Stake with us';
    projectButtonsWrapper.appendChild(stakeButton);
  }

  if (project.get_involved_url) {
    const getInvolvedButton = document.createElement('a');
    getInvolvedButton.classList.add('each-project-button');
    getInvolvedButton.classList.add('each-project-get-involved-button');
    getInvolvedButton.href = project.get_involved_url;
    getInvolvedButton.target = '_blank';
    getInvolvedButton.innerHTML = 'Get Involved';
    projectButtonsWrapper.appendChild(getInvolvedButton);
  }

  const setUpButton = document.createElement('a');
  setUpButton.classList.add('each-project-button');
  setUpButton.classList.add('each-project-guide-button');
  setUpButton.href = '/projects/guide/' + project.identifier;
  setUpButton.innerHTML = 'Set-Up Guide';
  projectButtonsWrapper.appendChild(setUpButton);

  projectContentWrapper.appendChild(projectButtonsWrapper);

  projectWrapper.appendChild(projectContentWrapper);

  document.querySelector('.projects-wrapper').appendChild(projectWrapper);
}

function writeAnimation(element, text, callback) {
  if (!text || !text.length)
    return callback();

  element.innerHTML = element.innerHTML + text[0];

  setTimeout(() => {
    writeAnimation(element, text.substring(1, text.length), () => {
      callback();
    });
  }, 170);
}

function textAnimation(textCount) {
  if (textCount > 3)
    return;

  const wrapper = document.querySelector('.start-page-animation-wrapper');

  if (wrapper.childElementCount >= 3) {
    wrapper.innerHTML = '';
    textCount = 1;
  }

  const text = document.getElementById('start-page-animation-text-' + textCount).innerHTML;

  const newTextWrapper = document.createElement('div');;
  newTextWrapper.classList.add('start-page-motto-wrapper');

  if (document.querySelector('.start-page-motto-cursor'))
    document.querySelector('.start-page-motto-cursor').remove();

  const newCursor = document.createElement('div');
  newCursor.classList.add('start-page-motto-cursor');
  newTextWrapper.appendChild(newCursor);

  const newText = document.createElement('div');
  newText.classList.add('start-page-motto');
  newTextWrapper.appendChild(newText);

  wrapper.appendChild(newTextWrapper);

  writeAnimation(newText, text, () => {
    if (textCount < 3)
      newCursor.remove();
    textAnimation(textCount+1);
  });
}

function repeatTextAnimation() {
  if (lastAnimationStartTime + TEN_SECOND_IN_MS > now())
    return;

  lastAnimationStartTime = now();
  
  const wrapper = document.querySelector('.start-page-animation-wrapper');
  wrapper.innerHTML = '';

  textAnimation(1);

  setTimeout(() => {
    repeatTextAnimation();
  }, TEN_SECOND_IN_MS);
}

function smoothScroll(element, amount) {
  if (amount < 10)
    return;

  element.scrollBy(0, 10);

  setTimeout(() => {
    smoothScroll(element, amount - 10);
  }, 5);
}

window.addEventListener('load', () => {
  setTimeout(() => {
    repeatTextAnimation();
  }, 200);

  document.querySelector('.all-wrapper').addEventListener('scroll', event => {
    document.querySelector('.learn-more-button').style.opacity = 1 - Math.min(event.target.scrollTop, 80) / 80;
    if (event.target.scrollTop >= 80)
      document.querySelector('.learn-more-button').style.display = 'none';
    else
      document.querySelector('.learn-more-button').style.display = 'flex';
  });

  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'each-project-wrapper')) {
      const target = ancestorWithClassName(event.target, 'each-project-wrapper');

      if (target.classList.contains('each-project-wrapper-opened'))
        return;

      if (document.querySelector('.each-project-wrapper-opened'))
        document.querySelector('.each-project-wrapper-opened').classList.remove('each-project-wrapper-opened');

      target.classList.add('each-project-wrapper-opened');
    }

    if (ancestorWithClassName(event.target, 'learn-more-button')) {
      smoothScroll(document.querySelector('.all-wrapper'), window.innerHeight - 80);
    }
  });
});
