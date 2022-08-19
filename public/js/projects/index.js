function createProject(project) {
  const projectWrapper = document.createElement('div');
  projectWrapper.classList.add('each-project-wrapper');
  projectWrapper.classList.add('each-project-' + project.status);

  const projectHeaderWrapper = document.createElement('div');
  projectHeaderWrapper.classList.add('each-project-header-wrapper');

  const projectLogo = document.createElement('div');
  projectLogo.classList.add('each-project-logo');
  projectLogo.style.backgroundImage = `url(${project.image})`;
  projectHeaderWrapper.appendChild(projectLogo);

  const projectName = document.createElement('div');
  projectName.classList.add('each-project-name')
  projectName.innerHTML = project.name;
  projectName.style.color = statusColors[project.status];
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
  console.log(project.description)
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

window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'each-project-wrapper')) {
      const target = ancestorWithClassName(event.target, 'each-project-wrapper');

      if (target.classList.contains('each-project-wrapper-opened'))
        return;

      if (document.querySelector('.each-project-wrapper-opened'))
        document.querySelector('.each-project-wrapper-opened').classList.remove('each-project-wrapper-opened');

      target.classList.add('each-project-wrapper-opened');
    }

    if (event.target.classList.contains('each-status-color-wrapper') || (event.target.parentNode && event.target.parentNode.classList.contains('each-status-color-wrapper'))) {
      const target = event.target.classList.contains('each-status-color-wrapper') ? event.target : event.target.parentNode;
      const status = target.id.replace('status-', '');
      const projects = document.querySelectorAll('.each-project-wrapper');

      if (target.classList.contains('each-status-color-wrapper-selected')) {
        target.classList.remove('each-status-color-wrapper-selected');

        for (let i = 0; i < projects.length; i++)
          projects[i].style.display = 'flex';
      } else {
        if (document.querySelector('.each-status-color-wrapper-selected'))
          document.querySelector('.each-status-color-wrapper-selected').classList.remove('each-status-color-wrapper-selected');

        target.classList.add('each-status-color-wrapper-selected');

        for (let i = 0; i < projects.length; i++)
          if (!projects[i].classList.contains('each-project-' + status))
            projects[i].style.display = 'none';
          else
            projects[i].style.display = 'flex';
      }
    }
  });

  const scrollDistance = document.querySelector('.projects-title-wrapper').getBoundingClientRect().top;

  document.querySelector('.all-wrapper').addEventListener('scroll', event => {
    const projectsTitle = document.querySelector('.projects-title');
    const projectsHeaderWrapper = document.querySelector('.projects-header-wrapper');
    const projectsWrapper = document.querySelector('.projects-wrapper');

    const scrollHeight = event.target.scrollTop;

    // Animations for responsive design to header
    if (scrollDistance == 140 || scrollDistance == 170) {
      if (scrollHeight >= 120) {
        projectsTitle.style.fontSize = '0px';
        projectsHeaderWrapper.style.position = 'fixed';
        projectsHeaderWrapper.style.marginTop = '-60px';
        projectsHeaderWrapper.style.backgroundColor = `rgba(248, 248, 248, ${(scrollHeight-120) / 60})`;
        projectsWrapper.style.marginTop = '90px';
      } else {
        projectsHeaderWrapper.style.position = 'initial';
        projectsHeaderWrapper.style.marginTop = '0px';
        projectsHeaderWrapper.style.backgroundColor = 'rgb(254, 254, 254)';
        projectsWrapper.style.marginTop = '30px';

        if (scrollHeight >= 50)
          projectsTitle.style.fontSize = ((1 - ( (scrollHeight-50) / 80 )) * 60) + 'px';
        else
          projectsTitle.style.fontSize = '60px';
      }
    } else if (scrollDistance == 150) {
      if (scrollHeight >= 115) {
        projectsTitle.style.fontSize = '0px';
        projectsHeaderWrapper.style.position = 'fixed';
        projectsHeaderWrapper.style.marginTop = '-60px';
        projectsHeaderWrapper.style.backgroundColor = `rgba(248, 248, 248, ${(scrollHeight-115) / 60})`;
        projectsWrapper.style.marginTop = '125px';
      } else {
        projectsHeaderWrapper.style.position = 'initial';
        projectsHeaderWrapper.style.marginTop = '0px';
        projectsHeaderWrapper.style.backgroundColor = 'rgb(254, 254, 254)';
        projectsWrapper.style.marginTop = '30px';

        if (scrollHeight >= 45)
          projectsTitle.style.fontSize = ((1 - ( (scrollHeight-45) / 70 )) * 60) + 'px';
        else
          projectsTitle.style.fontSize = '60px';
      }
    } else if (scrollDistance == 160) {
      if (scrollHeight >= 80) {
        projectsTitle.style.fontSize = '0px';
        projectsHeaderWrapper.style.position = 'fixed';
        projectsHeaderWrapper.style.marginTop = '-50px';
        projectsHeaderWrapper.style.backgroundColor = `rgba(248, 248, 248, ${(scrollHeight-115) / 50})`;
        projectsWrapper.style.marginTop = '125px';
      } else {
        projectsHeaderWrapper.style.position = 'initial';
        projectsHeaderWrapper.style.marginTop = '0px';
        projectsHeaderWrapper.style.backgroundColor = 'rgb(254, 254, 254)';
        projectsWrapper.style.marginTop = '30px';

        if (scrollHeight >= 20)
          projectsTitle.style.fontSize = ((1 - ( (scrollHeight-20) / 60 )) * 50) + 'px';
        else
          projectsTitle.style.fontSize = '50px';
      }
    }
  });
});
