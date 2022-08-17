const content_item_type_placeholders = {
  title: 'Enter the title',
  text: 'Enter the text',
  code: 'Enter the code line',
  info: 'Enter the info',
  image: 'Enter the image url',
  video: 'Enter the YouTube url (use /embed/id syntax)'
}

let blog;
let selected_content_item_type = 'title'; // Default
let currentGuideItemCountOnEdit = 0;

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
  blog = JSON.parse(document.getElementById('blog-json').value);

  const contentItemsWrapper = document.querySelector('.blog-content-items-wrapper');
  const contentItemInput = document.getElementById('new-content-item-text-input');
  let lastGuideItemExists = false;

  contentItemInput.addEventListener('keyup', event => {
    if (event.key != 'Enter') {
      if (lastGuideItemExists) {
        if (event.target.value) {
          if (selected_content_item_type == 'image')
            contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].style.backgroundImage = `url(${event.target.value})`
          else if (selected_content_item_type == 'video')
            contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].src = event.target.value;
          else
            contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].innerHTML = event.target.value.split('\n').join('<br/>');
        } else {
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].remove();
          lastGuideItemExists = false;
        }
      } else if (event.target.value) {
        lastGuideItemExists = true;

        const newGuideItemWrapper = document.createElement('div');
        newGuideItemWrapper.classList.add('content-item-outer-wrapper');

        let newGuideItem;

        if (selected_content_item_type == 'video') {
          newGuideItem = document.createElement('iframe');
          newGuideItem.classList.add('content-video');
        } else {
          newGuideItem = document.createElement('div');
          newGuideItem.classList.add('content-' + selected_content_item_type);
        }
       
        if (selected_content_item_type == 'image')
          newGuideItem.style.backgroundImage = `url(${event.target.value})`
        else if (selected_content_item_type == 'video')
          newGuideItem.src = event.target.value;
        else
          newGuideItem.innerHTML = event.target.value.split('\n').join('<br/>');
        newGuideItemWrapper.appendChild(newGuideItem);

        const newGuideItemDeleteButton = document.createElement('i');
        newGuideItemDeleteButton.classList.add('content-item-delete-button')
        newGuideItemDeleteButton.classList.add('fas');
        newGuideItemDeleteButton.classList.add('fa-trash-alt');
        newGuideItemWrapper.appendChild(newGuideItemDeleteButton);

        contentItemsWrapper.appendChild(newGuideItemWrapper);
      }
    }
  });

  document.addEventListener('click', event => {
    if (event.target.classList.contains('delete-image-button')) {
      const wrapper = event.target.parentNode.parentNode;

      // Do not delete the image. This is edit, will delete image when the new one is uploaded

      createImagePicker(wrapper);
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

    if (event.target.classList.contains('content-item-edit-button')) {
      currentGuideItemCountOnEdit++;

      const contentItemType = event.target.previousElementSibling.className.replace('content-', '');

      const contentItemEditInput = document.createElement('textarea');
      contentItemEditInput.classList.add('new-blog-form-input');
      contentItemEditInput.classList.add('content-item-edit-input');

      contentItemEditInput.id = 'content-edit-input-' + contentItemType;
      contentItemEditInput.placeholder = 'Please enter a value.';
      contentItemEditInput.value = event.target.previousElementSibling.innerHTML;

      event.target.previousElementSibling.remove();

      event.target.parentNode.appendChild(contentItemEditInput);
      while (contentItemEditInput.previousElementSibling)
        event.target.parentNode.insertBefore(contentItemEditInput, contentItemEditInput.previousElementSibling);

      contentItemEditInput.focus();

      setTimeout(() => {
        event.target.classList.remove('content-item-edit-button');
        event.target.classList.add('content-item-edit-finish-button');
        event.target.classList.remove('fa-cog');
        event.target.classList.add('fa-check');
      }, 500);
    }

    if (event.target.classList.contains('content-item-edit-finish-button')) {
      const contentInput = event.target.previousElementSibling;

      if (!contentInput || !contentInput.value || !contentInput.value.length)
        return;

      currentGuideItemCountOnEdit--;

      const contentItemType = contentInput.id.replace('content-edit-input-', '');

      const contentItem = document.createElement('div');
      contentItem.classList.add('content-' + contentItemType);
      contentItem.innerHTML = contentInput.value.split('\n').join('<br/>');

      contentInput.remove();

      event.target.parentNode.appendChild(contentItem);
      while (contentItem.previousElementSibling)
        event.target.parentNode.insertBefore(contentItem, contentItem.previousElementSibling);

      setTimeout(() => {
        event.target.classList.remove('content-item-edit-finish-button');
        event.target.classList.add('content-item-edit-button');
        event.target.classList.remove('fa-check');
        event.target.classList.add('fa-cog');
      }, 500);
    }

    if (event.target.classList.contains('content-item-delete-button')) {
      event.target.parentNode.remove();
      lastGuideItemExists = false;
      contentItemInput.value = '';
      contentItemInput.focus();
    }

    if (event.target.classList.contains('new-content-item-type-selected') || event.target.parentNode.classList.contains('new-content-item-type-selected')) {
      document.querySelector('.new-content-item-type-selection-button').style.overflow = 'visible';
    } else if (!ancestorWithClassName(event.target, 'new-content-item-type-selection-button')) {
      document.querySelector('.new-content-item-type-selection-button').style.overflow = 'hidden';
    }

    if (event.target.classList.contains('each-new-content-item-type')) {
      if (lastGuideItemExists) {
        contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].classList.remove(`content-${selected_content_item_type}`);
        contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].classList.add(`content-${event.target.innerHTML.toLowerCase()}`);

        if (event.target.innerHTML.toLowerCase() == 'image') {
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].innerHTML = null;
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].style.backgroundImage = `url(${contentItemInput.value})`
        } else if (event.target.innerHTML.toLowerCase() == 'video') {
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].remove();

          const newGuideItem = document.createElement('iframe');
          newGuideItem.classList.add('content-video');
          newGuideItem.src = contentItemInput.value;

          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].appendChild(newGuideItem);
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].insertBefore(newGuideItem, newGuideItem.previousElementSibling);
        } else {
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].innerHTML = contentItemInput.value.split('\n').join('<br/>');;
          contentItemsWrapper.children[contentItemsWrapper.children.length - 1].childNodes[0].style.backgroundImage = null;
        }
      } 

      document.querySelector('.new-content-item-type-selected').childNodes[0].innerHTML = event.target.innerHTML;
      selected_content_item_type = event.target.innerHTML.toLowerCase();
      contentItemInput.placeholder = content_item_type_placeholders[selected_content_item_type];
      contentItemInput.focus();

      document.querySelector('.new-content-item-type-selection-button').style.overflow = 'hidden';
    }

    if (event.target.classList.contains('new-content-item-create-button')) {
      if (selected_content_item_type != 'image' && selected_content_item_type != 'video') {
        const lastGuideItem = contentItemsWrapper.children[contentItemsWrapper.children.length - 1];

        const newGuideItemEditButton = document.createElement('i');
        newGuideItemEditButton.classList.add('content-item-edit-button')
        newGuideItemEditButton.classList.add('fas');
        newGuideItemEditButton.classList.add('fa-cog');
        lastGuideItem.appendChild(newGuideItemEditButton);

        lastGuideItem.insertBefore(newGuideItemEditButton, newGuideItemEditButton.previousElementSibling);
      }

      contentItemInput.value = '';
      lastGuideItemExists = false;
      contentItemInput.focus();
    }

    if (event.target.id == 'edit-blog-back-button') {
      createConfirm({
        title: 'Are you sure you want to exit this page?',
        text: 'Your changes will not be saved. You may loose your progress.',
        accept: 'Exit the Page',
        reject: 'Cancel'
      }, res => {
        if (res) history.back();
      });
    }

    if (event.target.id == 'edit-blog-save-button') {
      const error = document.getElementById('edit-blog-form-error');

      error.innerHTML = '';

      if (currentGuideItemCountOnEdit)
        return error.innerHTML = 'You have unsaved changes in content items. Please save them before continue.';

      const data = {
        writer_id: document.getElementById('writer-input').value,
        title: document.getElementById('title-input').value,
        subtitle: document.getElementById('subtitle-input').value,
        content: []
      };

      if (!data.writer_id || !data.writer_id.length)
        return error.innerHTML = 'Please select a writer.';

      if (!data.title || !data.title.length)
        return error.innerHTML = 'Please enter a title.';

      const contentItems = document.querySelectorAll('.content-item-outer-wrapper');

      for (let i = 0; i < contentItems.length; i++) {
        const contentItem = contentItems[i].childNodes[0];
        const type = contentItem.className.replace('content-', '');
        const content = type == 'image' ? contentItem.style.backgroundImage.replace('url(', '').replace(')', '').trim() : (type == 'video' ? contentItem.src : contentItem.innerHTML);
        data.content.push({
          type,
          content
        });
      }

      serverRequest('/admin/blogs/edit?id=' + blog._id, 'POST', data, res => {
        if (res.success)
          return window.location.reload();
        if (res.error == 'duplicated_unique_field')
          return createConfirm({
            title: 'Title Duplicate',
            text: 'A blog with this title already exists. Please enter a different title',
            reject: 'Close'
          }, res => { return; });

        createConfirm({
          title: 'An Error Occured',
          text: 'An error occured while saving your blog. Please try again later or contact our developer team. Error message: ' + res.error ? res.error : 'unknown_error',
          reject: 'Close'
        }, res => { return; });
      });
    }
  });

  document.addEventListener('change', event => {
    if (event.target.classList.contains('image-input')) {
      const file = event.target.files[0];

      const fileType = event.target.parentNode.parentNode.parentNode.id == 'logo-input-wrapper' ? 'logo' : 'image';

      event.target.parentNode.style.cursor = 'progress';
      event.target.parentNode.childNodes[0].innerHTML = 'Uploading...';
      event.target.parentNode.childNodes[1].type = 'text';

      uploadImage(file, (err, url) => {
        if (err) return throwError(err);

        serverRequest(`/admin/blogs/${fileType}?id=${blog._id}`, 'POST', {
          [fileType]: url
        }, res => {
          if (!res.success) return createConfirm({
            title: 'An Error Occured',
            text: 'An error occured while uploading the image. Please try again later or contact our developer team. Error message: ' + res.error ? res.error : 'unknown_error',
            reject: 'Close'
          }, res => { return; });

          createUploadedImage(url, event.target.parentNode.parentNode);
        });
      });
    }
  });
});
