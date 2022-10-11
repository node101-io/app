let project;
let selected_guide_item_type = 'title'; // Default
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
  project = JSON.parse(document.getElementById('project-json').value);

  const guideItemsWrapper = document.querySelector('.project-guide-items-wrapper');
  const guideItemInput = document.getElementById('new-guide-item-text-input');
  const inputItemsWrapper = document.querySelector('.add-new-guide-item-button');
  let guideImageInput = document.getElementById('content-image-input');
  const contentImageInputOuter = document.getElementById('content-image-input').parentNode;
  guideImageInput.style.display = 'none';
  let lastGuideItemExists = false;
  let tempURL = ''

  document.addEventListener('click', event => {
    if (event.target.classList.contains('delete-image-button')) {
      const wrapper = event.target.parentNode.parentNode;

      // Do not delete the image. This is edit, will delete image when the new one is uploaded

      createImagePicker(wrapper);
    }

    if (event.target.classList.contains('guide-item-edit-button')) {
      currentGuideItemCountOnEdit++;

      const guideItemType = event.target.previousElementSibling.className.replace('guide-', '');

      const guideItemEditInput = document.createElement('textarea');
      guideItemEditInput.classList.add('new-project-form-input');
      guideItemEditInput.classList.add('guide-item-edit-input');

      guideItemEditInput.id = 'guide-edit-input-' + guideItemType;
      guideItemEditInput.placeholder = 'Please enter a value.';
      guideItemEditInput.value = event.target.previousElementSibling.innerHTML;

      event.target.previousElementSibling.remove();

      event.target.parentNode.appendChild(guideItemEditInput);
      while (guideItemEditInput.previousElementSibling)
        event.target.parentNode.insertBefore(guideItemEditInput, guideItemEditInput.previousElementSibling);

      guideItemEditInput.focus();

      setTimeout(() => {
        event.target.classList.remove('guide-item-edit-button');
        event.target.classList.add('guide-item-edit-finish-button');
        event.target.classList.remove('fa-cog');
        event.target.classList.add('fa-check');
      }, 500);
    }

    if (event.target.classList.contains('guide-item-edit-finish-button')) {
      const guideInput = event.target.previousElementSibling;

      if (!guideInput || !guideInput.value || !guideInput.value.length)
        return;

      currentGuideItemCountOnEdit--;

      const guideItemType = guideInput.id.replace('guide-edit-input-', '');

      const guideItem = document.createElement('div');
      guideItem.classList.add('guide-' + guideItemType);
      guideItem.innerHTML = guideInput.value.split('\n').join('<br/>');

      guideInput.remove();

      event.target.parentNode.appendChild(guideItem);
      while (guideItem.previousElementSibling)
        event.target.parentNode.insertBefore(guideItem, guideItem.previousElementSibling);

      setTimeout(() => {
        event.target.classList.remove('guide-item-edit-finish-button');
        event.target.classList.add('guide-item-edit-button');
        event.target.classList.remove('fa-check');
        event.target.classList.add('fa-cog');
      }, 500);
    }

    if (event.target.classList.contains('guide-item-delete-button')) {
      event.target.parentNode.remove();
      lastGuideItemExists = false;
      guideItemInput.value = '';
      guideItemInput.focus();
    }

    if (event.target.id == 'edit-project-save-button') {
      const error = document.getElementById('new-project-form-error');

      error.innerHTML = '';

      if (currentGuideItemCountOnEdit)
        return error.innerHTML = 'You have unsaved changes in guide items. Please save them before continue.';

      const data = {
        name: document.getElementById('name-input').value,
        image: imageWrapper.querySelector('img').src,
        is_active: document.getElementById('status-input').value,
        stake_url: document.getElementById('stake-url-input').value,
        how_to_stake_url: document.getElementById('how-to-stake-url-input').value,
        market_price_url: document.getElementById('price-input').value,
        apr_api_url: document.getElementById('apr-input').value
      };

      if (!data.name || !data.name.length)
        return error.innerHTML = 'Please enter a name.';

      if (!data.status || !status_values.includes(data.status))
        return error.innerHTML = 'Please enter a valid status.';

      serverRequest('/admin/projects/edit?id=' + project._id, 'POST', data, res => {
        if (res.success)
          return window.location.reload();

        createConfirm({
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
        tempURL = url
        serverRequest('/admin/projects/image?id=' + project._id, 'POST', {
          image: url
        }, res => {
          if (!res.success) return createConfirm({
            title: 'An Error Occured',
            text: 'An error occured while uploading the image. Please try again later or contact our developer team. Error message: ' + res.error ? res.error : 'unknown_error',
            reject: 'Close'
          }, res => { return; });

          createUploadedImage(url, event.target.parentNode.parentNode);
          lastContentItemExists = true;
        });
      });
    }
  });
});
