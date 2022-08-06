let writer;

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
  writer = JSON.parse(document.getElementById('writer-json').value);

  document.addEventListener('click', event => {
    if (event.target.classList.contains('delete-image-button')) {
      const wrapper = event.target.parentNode.parentNode;

      // Do not delete the image. This is edit, will delete image when the new one is uploaded

      createImagePicker(wrapper);
    }

    if (event.target.id == 'edit-writer-back-button') {
      createConfirm({
        title: 'Are you sure you want to exit this page?',
        text: 'Your changes will not be saved. You may loose your progress.',
        accept: 'Exit the Page',
        reject: 'Cancel'
      }, res => {
        if (res) history.back();
      });
    }

    if (event.target.id == 'edit-writer-save-button') {
      const error = document.getElementById('edit-writer-form-error');

      error.innerHTML = '';

      const data = {
        name: document.getElementById('name-input').value,
        position: document.getElementById('position-input').value,
        links: {
          linkedin: document.getElementById('links-linkedin-input').value,
          github: document.getElementById('links-github-input').value,
          telegram: document.getElementById('links-telegram-input').value,
          medium: document.getElementById('links-medium-input').value,
          twitter: document.getElementById('links-twitter-input').value,
          instagram: document.getElementById('links-instagram-input').value,
          discord: document.getElementById('links-discord-input').value
        }
      };

      if (!data.name || !data.name.length)
        return error.innerHTML = 'Please enter a name.';
      
      if (!data.position || !data.position.length)
        return error.innerHTML = 'Please enter a description.';

      serverRequest('/admin/writers/edit?id=' + writer._id, 'POST', data, res => {
        if (res.success)
          return window.location.reload();

        createConfirm({
          title: 'An Error Occured',
          text: 'An error occured while saving your writer. Please try again later or contact our developer team. Error message: ' + res.error ? res.error : 'unknown_error',
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

        serverRequest('/admin/writers/image?id=' + writer._id, 'POST', {
          image: url
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
