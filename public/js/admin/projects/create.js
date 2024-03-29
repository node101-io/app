let selected_guide_item_type = 'title'; // Default
const guide_item_type_placeholders = {
  title: 'Enter the title',
  text: 'Enter the text',
  code: 'Enter the code line',
  info: 'Enter the info',
  image: 'Enter the image url',
  video: 'Enter the YouTube url (use /embed/id syntax)'
}
const language_values = ['all', 'en', 'tr', 'ru'];
const status_values = ['active', 'upcoming', 'ended'];
const popularity_values = ['low', 'medium', 'high'];

function uploadImage (file, callback) {
  const formdata = new FormData();
  formdata.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/upload');
  xhr.send(formdata);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const res = JSON.parse(xhr.responseText);

      if (!res.success)
        return callback(res.error || 'unknown_error');

      return callback(null, res.url);
    }
  };
}

function createImagePicker (wrapper) {
  const settingsImagePicker = document.createElement('label');
  settingsImagePicker.classList.add('choose-image-input-text');

  const span = document.createElement('span');
  span.innerHTML = 'Click to choose an image from your device';
  settingsImagePicker.appendChild(span);

  const input = document.createElement('input');
  input.classList.add('display-none');
  input.classList.add('image-input');
  input.accept = 'image/*';
  input.type = 'file';

  settingsImagePicker.appendChild(input);

  wrapper.innerHTML = '';
  wrapper.appendChild(settingsImagePicker);
}

function createUploadedImage (url, wrapper) {
  const imageInputWrapper = document.createElement('div');
  imageInputWrapper.classList.add('image-input-wrapper');

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('image-input-wrapper-image');
  const image = document.createElement('img');
  image.src = url;
  imageWrapper.appendChild(image);
  imageInputWrapper.appendChild(imageWrapper);

  const i = document.createElement('i');
  i.classList.add('fas');
  i.classList.add('fa-times');
  i.classList.add('delete-image-button');
  imageInputWrapper.appendChild(i);

  wrapper.innerHTML = '';
  wrapper.appendChild(imageInputWrapper);
}

window.addEventListener('load', () => {
  const guideItemsWrapper = document.querySelector('.project-guide-items-wrapper');
  const guideItemInput = document.getElementById('new-guide-item-text-input');
  const contentImageInputOuterWrapper = document.getElementById('content-image-input-outer-wrapper');
  let lastGuideItemExists = false;


  guideItemInput.addEventListener('keyup', event => {
    if (event.key != 'Enter') {
      if (lastGuideItemExists) {
        if (event.target.value) {
          if (selected_guide_item_type == 'image')
            guideItemsWrapper.children[guideItemsWrapper.children.length - 1].childNodes[0].style.backgroundImage = `url(${event.target.value})`
          else if (selected_guide_item_type == 'video')
            guideItemsWrapper.children[guideItemsWrapper.children.length - 1].childNodes[0].src = event.target.value;
          else
            guideItemsWrapper.children[guideItemsWrapper.children.length - 1].childNodes[0].innerHTML = event.target.value.split('\n').join('<br/>');
        } else {
          guideItemsWrapper.children[guideItemsWrapper.children.length - 1].remove();
          lastGuideItemExists = false;
        }
      } else if (event.target.value) {
        lastGuideItemExists = true;

        const newGuideItemWrapper = document.createElement('div');
        newGuideItemWrapper.classList.add('guide-item-outer-wrapper');

        let newGuideItem;

        if (selected_guide_item_type == 'video') {
          newGuideItem = document.createElement('iframe');
          newGuideItem.classList.add('guide-video');
        } else {
          newGuideItem = document.createElement('div');
          newGuideItem.classList.add('guide-' + selected_guide_item_type);
        }
       
        if (selected_guide_item_type == 'image')
          newGuideItem.style.backgroundImage = `url(${event.target.value})`
        else if (selected_guide_item_type == 'video')
          newGuideItem.src = event.target.value;
        else
          newGuideItem.innerHTML = event.target.value.split('\n').join('<br/>');
        newGuideItemWrapper.appendChild(newGuideItem);

        const newGuideItemDeleteButton = document.createElement('i');
        newGuideItemDeleteButton.classList.add('guide-item-delete-button')
        newGuideItemDeleteButton.classList.add('fas');
        newGuideItemDeleteButton.classList.add('fa-trash-alt');
        newGuideItemWrapper.appendChild(newGuideItemDeleteButton);

        guideItemsWrapper.appendChild(newGuideItemWrapper);
      }
    }
  });

  document.addEventListener('click', event => {
    if (event.target.classList.contains('delete-image-button')) {
      const wrapper = event.target.parentNode.parentNode;
      const url = event.target.parentNode.childNodes[0].childNodes[0].src;
      if(lastContentItemExists){
      serverRequest(`/image/delete?url=${url}`, 'GET', {}, res => {
        if (!res.success) return throwError(res.error);
      });
    }
      createImagePicker(wrapper);
      lastContentItemExists = false;
    }

    if (event.target.classList.contains('guide-item-delete-button')) {
      event.target.parentNode.remove();
      lastGuideItemExists = false;
      guideItemInput.value = '';
      guideItemInput.focus();
    }

    if (event.target.classList.contains('new-guide-item-type-selected') || event.target.parentNode.classList.contains('new-guide-item-type-selected')) {
      document.querySelector('.new-guide-item-type-selection-button').style.overflow = 'visible';
    } else if (!event.target.classList.contains('new-guide-item-type-selection-button') && !event.target.parentNode.classList.contains('new-guide-item-type-selection-button') && !event.target.parentNode.parentNode.classList.contains('new-guide-item-type-selection-button')) {
      document.querySelector('.new-guide-item-type-selection-button').style.overflow = 'hidden';
    }

    if (event.target.classList.contains('each-new-guide-item-type')) {
      if (lastGuideItemExists) {
        guideItemsWrapper.children[guideItemsWrapper.children.length - 1].childNodes[0].classList.remove(`guide-${selected_guide_item_type}`);
        guideItemsWrapper.children[guideItemsWrapper.children.length - 1].childNodes[0].classList.add(`guide-${event.target.innerHTML.toLowerCase()}`);

        if (event.target.innerHTML.toLowerCase() == 'image') {
          guideItemInput = '';
          lastContentItemExists = false;
        } else if (event.target.innerHTML.toLowerCase() == 'video') {
          guideItemsWrapper.children[guideItemsWrapper.children.length - 1].childNodes[0].remove();

          const newGuideItem = document.createElement('iframe');
          newGuideItem.classList.add('guide-video');
          newGuideItem.src = guideItemInput.value;

          guideItemsWrapper.children[guideItemsWrapper.children.length - 1].appendChild(newGuideItem);
          guideItemsWrapper.children[guideItemsWrapper.children.length - 1].insertBefore(newGuideItem, newGuideItem.previousElementSibling);
        } else {
          guideItemsWrapper.children[guideItemsWrapper.children.length - 1].childNodes[0].innerHTML = guideItemInput.value.split('\n').join('<br/>');;
          guideItemsWrapper.children[guideItemsWrapper.children.length - 1].childNodes[0].style.backgroundImage = null;
        }
      } 

      document.querySelector('.new-guide-item-type-selected').childNodes[0].innerHTML = event.target.innerHTML;
      selected_guide_item_type = event.target.innerHTML.toLowerCase();
      if (selected_content_item_type == 'image') {
        guideImageInputOuterWrapper.style.display = 'flex';
        guideItemInput.style.display = 'none';
      }
      else {
        guideImageInputOuterWrapper.style.display = 'none';
        guideItemInput.style.display = 'flex'
        guideItemInput.placeholder = guide_item_type_placeholders[selected_guide_item_type];
        guideItemInput.focus();
      }
      document.querySelector('.new-guide-item-type-selection-button').style.overflow = 'hidden';
    }

    if (event.target.classList.contains('new-guide-item-create-button')) {
      if(selected_guide_item_type == 'image') {
        const newContentItemWrapper = document.createElement('div');
        newContentItemWrapper.classList.add('guide-item-outer-wrapper');
  
        let newContentItem;

        newContentItem = document.createElement('div');
        newContentItem.classList.add('guide-' + selected_guide_item_type);
        newContentItem.style.backgroundImage = `url(${guideImageInputOuterWrapper.querySelector('img').src})`
        
        newContentItemWrapper.appendChild(newContentItem);

        const newContentItemDeleteButton = document.createElement('i');
        newContentItemDeleteButton.classList.add('guide-item-delete-button');
        newContentItemDeleteButton.classList.add('fas');
        newContentItemDeleteButton.classList.add('fa-trash-alt');
        newContentItemWrapper.appendChild(newContentItemDeleteButton);

        guideItemsWrapper.appendChild(newContentItemWrapper);
        
        lastContentItemExists = false;
      }
        guideItemInput.value = '';
        lastGuideItemExists = false;
        guideItemInput.focus();
      
    }

    if (event.target.id == 'new-project-back-button') {
      createConfirm({
        title: 'Are you sure you want to exit this page?',
        text: 'The page will not be saved. You may loose your progress.',
        accept: 'Exit the Page',
        reject: 'Cancel'
      }, res => {
        if (res) history.back();
      })
    }

    if (event.target.classList.contains('new-requirement-add-button')) {
      const name = document.getElementById('new-requirement-name-input').value;
      const value = document.getElementById('new-requirement-value-input').value;

      if (!name || !value)
        return;

      const newProjectRequirement = document.createElement('div');
      newProjectRequirement.classList.add('each-project-requirement');

      const requirementDeleteButton = document.createElement('i');
      requirementDeleteButton.classList.add('each-project-requirement-delete-button');
      requirementDeleteButton.classList.add('fas');
      requirementDeleteButton.classList.add('fa-trash-alt');
      newProjectRequirement.appendChild(requirementDeleteButton);

      const requirementContentWrapper = document.createElement('div');
      requirementContentWrapper.classList.add('each-project-requirement-content-wrapper');

      const requirementName = document.createElement('div');
      requirementName.classList.add('each-project-requirement-name');
      requirementName.innerHTML = name;
      requirementContentWrapper.appendChild(requirementName);

      const requirementSeperator = document.createElement('div');
      requirementSeperator.classList.add('each-project-requirement-seperator');
      requirementSeperator.innerHTML = ':';
      requirementContentWrapper.appendChild(requirementSeperator);

      const requirementValue = document.createElement('div');
      requirementValue.classList.add('each-project-requirement-value');
      requirementValue.innerHTML = value;
      requirementContentWrapper.appendChild(requirementValue);

      newProjectRequirement.appendChild(requirementContentWrapper);

      document.querySelector('.project-requirements-wrapper').appendChild(newProjectRequirement);
      document.querySelector('.project-requirements-wrapper').insertBefore(newProjectRequirement, newProjectRequirement.previousElementSibling);
      document.getElementById('new-requirement-name-input').value = '';
      document.getElementById('new-requirement-value-input').value = '';
    }

    if (event.target.classList.contains('each-project-requirement-delete-button')) {
      event.target.parentNode.remove();
    }

    if (event.target.id == 'new-project-create-button') {
      const error = document.getElementById('new-project-form-error');
      const imageWrapper = document.getElementById('image-input-wrapper');

      error.innerHTML = '';

      if (!imageWrapper.querySelector('img') || !imageWrapper.querySelector('img').src)
        return error.innerHTML = 'Please choose an image';

      const project = {
        language: document.getElementById('language-input').value,
        name: document.getElementById('name-input').value,
        image: imageWrapper.querySelector('img').src,
        description: document.getElementById('description-input').value,
        dates: document.getElementById('dates-input').value,
        reward: document.getElementById('reward-input').value,
        status: document.getElementById('status-input').value,
        popularity: document.getElementById('popularity-input').value,
        get_involved_url: document.getElementById('get-involved-url-input').value,
        will_be_stakable: document.getElementById('will-be-stakable-input').value && document.getElementById('will-be-stakable-input').value == 'true' ? true : false,
        guide: [],
        requirements: [],
        links: {
          web: document.getElementById('links-web-input').value,
          github: document.getElementById('links-github-input').value,
          telegram: document.getElementById('links-telegram-input').value,
          medium: document.getElementById('links-medium-input').value,
          twitter: document.getElementById('links-twitter-input').value,
          instagram: document.getElementById('links-instagram-input').value,
          gitbook: document.getElementById('links-gitbook-input').value,
          docs: document.getElementById('links-docs-input').value,
          discord: document.getElementById('links-discord-input').value,
          explorer: document.getElementById('links-explorer-input').value
        },
        stake_url: document.getElementById('stake-url-input').value,
        stake_api_title: document.getElementById('stake-api-title-input').value
      };

      if (!project.language || !language_values.includes(project.language))
        return error.innerHTML = 'Please enter a valid language.';

      if (!project.name || !project.name.length)
        return error.innerHTML = 'Please enter a name.';
      
      if (!project.description || !project.description.length)
        return error.innerHTML = 'Please enter a description.';

      if (!project.status || !status_values.includes(project.status))
        return error.innerHTML = 'Please enter a valid status.';

      if (!project.popularity || !popularity_values.includes(project.popularity))
        return error.innerHTML = 'Please enter a valid popularity.';

      const guideItems = document.querySelectorAll('.guide-item-outer-wrapper');

      for (let i = 0; i < guideItems.length; i++) {
        const guide = guideItems[i].childNodes[0];
        const type = guide.className.replace('guide-', '');
        const content = type == 'image' ? guide.style.backgroundImage.replace('url(', '').replace(')', '').trim() : (type == 'video' ? guide.src : guide.innerHTML);
        project.guide.push({
          type,
          content
        });
      }

      const requirements = document.querySelectorAll('.each-project-requirement-content-wrapper');

      for (let i = 0; i < requirements.length; i++)
        project.requirements.push({
          name: requirements[i].childNodes[0].innerHTML,
          content: requirements[i].childNodes[2].innerHTML
        });

      serverRequest('/admin/projects/create', 'POST', project, res => {
        if (res.success)
          return window.location = '/admin/projects';

        if (res.error && res.error == 'duplicated_unique_field')
          return createConfirm({
            title: 'Duplicated Project Name',
            text: 'A project with this name and language already exists. Please edit this project instead of adding a new one or change the project name.',
            reject: 'Close'
          }, res => { return; });

        return createConfirm({
          title: 'An Error Occured',
          text: 'An error occured while creating your project. Please try again later or contact our developer team. Error message: ' + res.error ? res.error : 'unknown_error',
          reject: 'Close'
        }, res => { return; });
      });
    }
  });

  document.addEventListener('change', event => {
    if (event.target.classList.contains('image-input')) {
      const file = event.target.files[0];

      event.target.parentNode.style.cursor = 'progress';
      event.target.parentNode.childNodes[0].innerHTML = 'Uploading...';
      event.target.parentNode.childNodes[1].type = 'text';

      uploadImage(file, (err, url) => {
        if (err) return throwError(err);
        
        createUploadedImage(url, event.target.parentNode.parentNode);
        lastContentItemExists = true;
      });
    }
  });
});
