window.addEventListener('load', () => {
  document.getElementById('login-form').onsubmit = event => {
    event.preventDefault();

    const password = document.getElementById('password-input').value;
    const error = document.getElementById('form-error');

    if (!password || !password.length) {
      document.getElementById('password-input').focus();
      return error.innerHTML = 'Please write the admin password.';
    }

    serverRequest('/admin/login', 'POST', {
      password
    }, res => {
      if (!res.success) {
        document.getElementById('password-input').focus();
        return error.innerHTML = 'The password is wrong.';
      }

      return location.href = '/admin';
    });
  }
});
