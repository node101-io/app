let isDeleteOnAction = false;

window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-blog-delete-button')) {
      if (isDeleteOnAction)
        return alert('Deleting something right now, please be patient!');
        
      createConfirm({
        title: 'Are you sure you want to delete this blog?',
        text: 'Any deleted blogs may be restored from the Deleted Blogs menu. All the visitors will loose access to this blog. Warning: This process may take some time, please be patient.',
        reject: 'Cancel',
        accept: 'Delete'
      }, res => {
        if (!res) return;

        isDeleteOnAction = true;
        const id = event.target.parentNode.id;

        serverRequest('/admin/blogs/delete?id=' + id, 'POST', {}, res => {
          isDeleteOnAction = false;

          if (!res.success) return createConfirm({
            title: 'An Error Occured',
            text: 'An unknown error occured while deleting the project. Error Message: ' + (res.error ? res.error : 'unknown_error'),
            reject: 'Close'
          }, res => { return; });
  
          event.target.parentNode.remove();
        });
      });
    }
  });
});
