const language_values = ['all', 'en', 'tr', 'ru'];

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

    if (event.target.id == 'new-project-create-button') {
      const error = document.getElementById('new-project-form-error');
      const imageWrapper = document.getElementById('image-input-wrapper');

      error.innerHTML = '';

      if (!imageWrapper.querySelector('img') || !imageWrapper.querySelector('img').src)
        return error.innerHTML = 'Please choose an image';

      const stake = {
        language: document.getElementById('language-input').value,
        name: document.getElementById('name-input').value,
        image: imageWrapper.querySelector('img').src,
        is_active: document.getElementById('status-input').value,
        stake_url: document.getElementById('stake-url-input').value,
        how_to_stake_url: document.getElementById('how-to-stake-url-input').value,
        market_price_url: document.getElementById('price-input').value,
        apr_api_url: document.getElementById('apr-input').value
      };

      if (!stake.language || !language_values.includes(stake.language))
        return error.innerHTML = 'Please enter a valid language.';

      if (!stake.name || !stake.name.length)
        return error.innerHTML = 'Please enter a name.';

      serverRequest('/admin/stake/create', 'POST', stake, res => {
        if (res.success)
          return window.location = '/admin/stake';

        if (res.error && res.error == 'duplicated_unique_field')
          return createConfirm({
            title: 'Duplicated Stake Name',
            text: 'A stake with this name and language already exists. Please edit this stake instead of adding a new one or change the stake name.',
            reject: 'Close'
          }, res => { return; });

        return createConfirm({
          title: 'An Error Occured',
          text: 'An error occured while creating your stake. Please try again later or contact our developer team. Error message: ' + res.error ? res.error : 'unknown_error',
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
