let selected_content_item_type = 'title'; // Default
const content_item_type_placeholders = {
  title: 'Enter the title',
  text: 'Enter the text',
  code: 'Enter the code line',
  info: 'Enter the info',
  image: 'Enter the image url',
  video: 'Enter the YouTube url (use /embed/id syntax)'
}
const language_values = ['all', 'en', 'tr', 'ru'];
const type_values = ['node101', 'term', 'project'];

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
  contentImageInput = wrapper
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
  const contentItemsWrapper = document.querySelector('.blog-content-items-wrapper');
  const contentItemInput = document.getElementById('new-content-item-text-input');
  const contentImageInputOuter = document.getElementById('content-image-input').parentNode;
  let contentImageInput = document.getElementById('content-image-input');
  const inputItemsWrapper = document.querySelector('.add-new-content-item-button');
  contentImageInput.style.display = 'none';
  let lastContentItemExists = false;
  let tempURL = ''
  
  

  contentItemInput.addEventListener('keyup', event => {
    if (event.key != 'Enter') {
      if (lastContentItemExists) {
        if (event.target.value) {
          if (selected_content_item_type == 'video')
            contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].src = event.target.value;
          else
            contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].innerHTML = event.target.value.split('\n').join('<br/>');
        } else {
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].remove();
          lastContentItemExists = false;
        }
      }
       else if (event.target.value) {
        lastContentItemExists = true;

        const newContentItemWrapper = document.createElement('div');
        newContentItemWrapper.classList.add('content-item-outer-wrapper');

        let newContentItem;

        if (selected_content_item_type == 'video') {
          newContentItem = document.createElement('iframe');
          newContentItem.classList.add('content-video');
        } else {
          newContentItem = document.createElement('div');
          newContentItem.classList.add('content-' + selected_content_item_type);
        }
       
        if (selected_content_item_type == 'image')
          newContentItem.style.backgroundImage = `url(${event.target.value})`
        else if (selected_content_item_type == 'video')
          newContentItem.src = event.target.value;
        else
          newContentItem.innerHTML = event.target.value.split('\n').join('<br/>');
        newContentItemWrapper.appendChild(newContentItem);

        const newContentItemDeleteButton = document.createElement('i');
        newContentItemDeleteButton.classList.add('content-item-delete-button');
        newContentItemDeleteButton.classList.add('fas');
        newContentItemDeleteButton.classList.add('fa-trash-alt');
        newContentItemWrapper.appendChild(newContentItemDeleteButton);

        contentItemsWrapper.appendChild(newContentItemWrapper);
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

    if (ancestorWithClassName(event.target, 'new-blog-selection-input')) {
      const target = ancestorWithClassName(event.target, 'new-blog-selection-input');

      if (document.querySelector('.new-blog-selection-input-open'))
        document.querySelector('.new-blog-selection-input-open').classList.remove('new-blog-selection-input-open');

      target.classList.add('new-blog-selection-input-open');
    } else if (document.querySelector('.new-blog-selection-input-open')) {
      document.querySelector('.new-blog-selection-input-open').classList.remove('new-blog-selection-input-open');
    }

    if (event.target.classList.contains('each-blog-selection-value')) {
      event.target.parentNode.parentNode.classList.remove('new-blog-selection-input-open');
      event.target.parentNode.parentNode.childNodes[0].value = event.target.id;
      event.target.parentNode.parentNode.childNodes[1].innerHTML = event.target.innerHTML;
    }

    if (event.target.classList.contains('content-item-delete-button')) {
      event.target.parentNode.remove();
      lastContentItemExists = false;
      contentItemInput.value = '';
      contentItemInput.focus();
    }

    if (event.target.classList.contains('new-content-item-type-selected') || event.target.parentNode.classList.contains('new-content-item-type-selected')) {
      document.querySelector('.new-content-item-type-selection-button').style.overflow = 'visible';
    } else if (!event.target.classList.contains('new-content-item-type-selection-button') && !event.target.parentNode.classList.contains('new-content-item-type-selection-button') && !event.target.parentNode.parentNode.classList.contains('new-content-item-type-selection-button')) {
      document.querySelector('.new-content-item-type-selection-button').style.overflow = 'hidden';
    }

    if (event.target.classList.contains('blog-type-selection-button')) {
      const language = document.getElementById('language-input').value;
      const type = document.getElementById('type-input').value;
      const projectValuesWrapper = document.getElementById('selection-project-values');

      if (!language || !language.length)
        return;

      if (type == 'project') {
        serverRequest('/projects/filter', 'POST', {
          language
        }, res => {
          if (!res.success)
            return alert(res.error);

          const projects = res.projects;

          console.log(projects);

          for (let i = 0; i < projects.length; i++) {
            const selectionValue = document.createElement('div');
            selectionValue.classList.add('each-blog-selection-value');
            selectionValue.id = projects[i]._id.toString();
            selectionValue.innerHTML = projects[i].name;
            projectValuesWrapper.appendChild(selectionValue);
          }
        })
      } else {
        projectValuesWrapper.innerHTML = '';
      }
    }

    if (event.target.classList.contains('each-new-content-item-type')) {
      if (lastContentItemExists) {
        contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].classList.remove(`content-${selected_content_item_type}`);
        contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].classList.add(`content-${event.target.innerHTML.toLowerCase()}`);

        if (event.target.innerHTML.toLowerCase() == 'image') {
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].innerHTML = null;
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].style.backgroundImage = `url(${contentItemInput.value})`
        } else if (event.target.innerHTML.toLowerCase() == 'video') {
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].remove();

          const newContentItem = document.createElement('iframe');
          newContentItem.classList.add('content-video');
          newContentItem.src = contentItemInput.value;

          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].appendChild(newContentItem);
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].insertBefore(newContentItem, newContentItem.previousElementSibling);
        } else {
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].innerHTML = contentItemInput.value.split('\n').join('<br/>');;
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].style.backgroundImage = null;
        }
      } 

      document.querySelector('.new-content-item-type-selected').childNodes[0].innerHTML = event.target.innerHTML;
      selected_content_item_type = event.target.innerHTML.toLowerCase();
      if(selected_content_item_type === 'image') {
        contentItemInput.value = '';
        contentItemInput.style.display = 'none';
        contentImageInputOuter.style.display = 'flex';
        contentImageInput.style.display = 'flex';
        contentImageInputOuter.style.marginTop = '20px';
        contentImageInputOuter.style.marginBottom = '80px';
        inputItemsWrapper.style.marginBottom = '0px';

      } else {
        contentImageInputOuter.style.marginTop = '0px'
        contentImageInputOuter.style.marginBottom = '0px'
        inputItemsWrapper.style.marginBottom = '80px'
        contentImageInputOuter.style.display = 'none'
        contentImageInput.style.display = 'none'
        contentItemInput.style.display = 'flex'
        contentItemInput.placeholder = content_item_type_placeholders[selected_content_item_type];
        contentItemInput.focus();
      }

      document.querySelector('.new-content-item-type-selection-button').style.overflow = 'hidden';
    }

    if (event.target.classList.contains('new-content-item-create-button')) {
      if(selected_content_item_type == 'image') {

        const newContentItemWrapper = document.createElement('div');
        newContentItemWrapper.classList.add('content-item-outer-wrapper');
  
        let newContentItem;

        newContentItem = document.createElement('div');
        newContentItem.classList.add('content-' + selected_content_item_type);
        newContentItem.style.backgroundImage = `url(${tempURL})`
        
        newContentItemWrapper.appendChild(newContentItem);

        const newContentItemDeleteButton = document.createElement('i');
        newContentItemDeleteButton.classList.add('content-item-delete-button');
        newContentItemDeleteButton.classList.add('fas');
        newContentItemDeleteButton.classList.add('fa-trash-alt');
        newContentItemWrapper.appendChild(newContentItemDeleteButton);

        contentItemsWrapper.appendChild(newContentItemWrapper);
        
        lastContentItemExists = false;
      } else {
        contentItemInput.value = '';
        lastContentItemExists = false;
        contentItemInput.focus();
      }
    }

    if (event.target.id == 'new-blog-back-button') {
      createConfirm({
        title: 'Are you sure you want to exit this page?',
        text: 'The page will not be saved. You may loose your progress.',
        accept: 'Exit the Page',
        reject: 'Cancel'
      }, res => {
        if (res) history.back();
      })
    }

    if (event.target.id == 'new-blog-create-button') {
      const error = document.getElementById('new-blog-form-error')
      const logoWrapper = document.getElementById('logo-input-wrapper');
      const imageWrapper = document.getElementById('image-input-wrapper');

      error.innerHTML = '';

      let logo = null;

      if (logoWrapper.querySelector('img') && logoWrapper.querySelector('img').src)
        logo = logoWrapper.querySelector('img').src;

      if (!imageWrapper.querySelector('img') || !imageWrapper.querySelector('img').src)
        return error.innerHTML = 'Please choose an image.';

      const blog = {
        language: document.getElementById('language-input').value,
        type: document.getElementById('type-input').value,
        writer_id: document.getElementById('writer-input').value,
        project_id: document.getElementById('project-id-input').value,
        title: document.getElementById('title-input').value,
        subtitle: document.getElementById('subtitle-input').value,
        logo,
        image: imageWrapper.querySelector('img').src,
        content: []
      };

      if (!blog.language || !language_values.includes(blog.language))
        return error.innerHTML = 'Please select a valid language.';
        
      if (!blog.type || !type_values.includes(blog.type))
        return error.innerHTML = 'Please select a valid language.';

      if (!blog.writer_id || !blog.writer_id.length)
        return error.innerHTML = 'Please select a writer.';

      if (!blog.title || !blog.title.length)
        return error.innerHTML = 'Please enter a title.';

      if (blog.type == 'project' && (!blog.project_id || !blog.project_id.length))
        return error.innerHTML = 'Please select a project.';

      const contentItems = document.querySelectorAll('.content-item-outer-wrapper');

      for (let i = 0; i < contentItems.length; i++) {
        const contentItem = contentItems[i].childNodes[0];
        const type = contentItem.className.replace('content-', '');
        const content = type == 'image' ? contentItem.style.backgroundImage.replace('url(', '').replace(')', '').trim() : (type == 'video' ? contentItem.src : contentItem.innerHTML);
        console.log(content)
        blog.content.push({
          type,
          content
        });
      }

      serverRequest('/admin/blogs/create', 'POST', blog, res => {
        
        if (res.success)
          return window.location = '/admin/blogs';
          
        if (res.error && res.error == 'duplicated_unique_field')
          return createConfirm({
            title: 'Duplicated Blog Title',
            text: 'A blog with this title already exists. Please edit this blog instead of adding a new one or change the blog title.',
            reject: 'Close'
          }, res => { return; });

        return createConfirm({
          title: 'An Error Occured',
          text: 'An error occured while creating your blog. Please try again later or contact our developer team. Error message: ' + res.error ? res.error : 'unknown_error',
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
        tempURL = url;
        createUploadedImage(url, event.target.parentNode.parentNode);
        lastContentItemExists = true;
      });
    }
  });
});
