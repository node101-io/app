function createProject(project) {
  const projectWrapper = document.createElement('div');
  projectWrapper.classList.add('each-project-wrapper');
  projectWrapper.classList.add('each-project-' + project.language);

  const projectHeaderWrapper = document.createElement('div');
  projectHeaderWrapper.classList.add('each-project-header-wrapper');

  const projectEditButton = document.createElement('a');
  projectEditButton.href = '/admin/edit?id=' + project._id;
  projectEditButton.classList.add('each-project-edit-button');
  projectEditButton.classList.add('fas');
  projectEditButton.classList.add('fa-cog');
  projectHeaderWrapper.appendChild(projectEditButton);

  const projectLogo = document.createElement('div');
  projectLogo.classList.add('each-project-logo');
  projectLogo.style.backgroundImage = `url(${project.image})`;
  projectHeaderWrapper.appendChild(projectLogo);

  const projectName = document.createElement('div');
  projectName.classList.add('each-project-name')
  projectName.innerHTML = project.name;
  projectName.style.color = languageColors[project.language];
  projectHeaderWrapper.appendChild(projectName);

  const projectInfoWrapper = document.createElement('div');
  projectInfoWrapper.classList.add('each-project-info-wrapper');

  const projectInfo1 = document.createElement('div');
  projectInfo1.classList.add('each-project-info');
  projectInfo1.innerHTML = project.dates;
  projectInfoWrapper.appendChild(projectInfo1);

  const projectInfoSeperator1 = document.createElement('div');
  projectInfoSeperator1.classList.add('each-project-info-seperator');
  projectInfoWrapper.appendChild(projectInfoSeperator1);

  const projectInfo2 = document.createElement('div');
  projectInfo2.classList.add('each-project-info');
  projectInfo2.style.color = 'rgb(130, 170, 235)';
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

  const projectDescription = document.createElement('div');
  projectDescription.classList.add('each-project-description');
  projectDescription.innerHTML = project.description;
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
  setUpButton.href = '/projects/guide?id=' + project._id;
  setUpButton.innerHTML = 'Set-Up Guide';
  projectButtonsWrapper.appendChild(setUpButton);

  projectContentWrapper.appendChild(projectButtonsWrapper);

  projectWrapper.appendChild(projectContentWrapper);

  document.querySelector('.projects-wrapper').appendChild(projectWrapper);
}

window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-project-wrapper') || (event.target.parentNode && (event.target.parentNode.classList.contains('each-project-wrapper') || (event.target.parentNode.parentNode && (event.target.parentNode.parentNode.classList.contains('each-project-wrapper') || (event.target.parentNode.parentNode.parentNode && event.target.parentNode.parentNode.parentNode.classList.contains('each-project-wrapper'))))))) {
      const target = event.target.classList.contains('each-project-wrapper') ? event.target : (event.target.parentNode.classList.contains('each-project-wrapper') ? event.target.parentNode : (event.target.parentNode.parentNode.classList.contains('each-project-wrapper') ? event.target.parentNode.parentNode : event.target.parentNode.parentNode.parentNode));

      if (target.classList.contains('each-project-wrapper-opened'))
        return;

      if (document.querySelector('.each-project-wrapper-opened'))
        document.querySelector('.each-project-wrapper-opened').classList.remove('each-project-wrapper-opened');

      target.classList.add('each-project-wrapper-opened');
    }

    if (event.target.classList.contains('each-status-color-wrapper') || (event.target.parentNode && event.target.parentNode.classList.contains('each-status-color-wrapper'))) {
      const target = event.target.classList.contains('each-status-color-wrapper') ? event.target : event.target.parentNode;
      const language = target.id.replace('language-', '');
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
          if (!projects[i].classList.contains('each-project-' + language))
            projects[i].style.display = 'none';
          else
            projects[i].style.display = 'flex';
      }
    }
  });
});
