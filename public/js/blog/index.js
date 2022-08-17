function createBlog(blog) {
  const eachBlog = document.createElement('a');
  eachBlog.classList.add('each-blog-wrapper');
  eachBlog.href = '/blog/' + blog.identifier

  const blogLogo = document.createElement('div');
  blogLogo.classList.add('each-blog-logo');
  blogLogo.style.backgroundImage = `url(${blog.logo})`;
  eachBlog.appendChild(blogLogo);

  const blogTitle = document.createElement('div');
  blogTitle.classList.add('each-blog-title');
  blogTitle.innerHTML = blog.title;
  eachBlog.appendChild(blogTitle);

  const blogSubtitle = document.createElement('div');
  blogSubtitle.classList.add('each-blog-subtitle');
  blogSubtitle.innerHTML = blog.subtitle;
  eachBlog.appendChild(blogSubtitle);

  document.querySelector('.blogs-wrapper').appendChild(eachBlog);
}

window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'each-blog-type')) {
      const target = ancestorWithClassName(event.target, 'each-blog-type');
      const id = target.id;
      const type = (id == 'node101' || id == 'term' ? id : 'project');
      const project_id = (type == 'project' ? id : null);

      document.getElementById('types-title').style.display = 'none';
      document.querySelector('.blog-types-wrapper').style.display = 'none';
      document.getElementById('blogs-title').style.display = 'block';
      document.querySelector('.blogs-wrapper').innerHTML = '';
      document.querySelector('.blogs-wrapper').style.display = 'block';
      document.querySelector('.back-button').style.display = 'block';

      serverRequest('/blog/filter', 'POST', {
        type,
        project_id,
        language: document.getElementById('page-language').value
      }, res => {
        if (!res.success) return alert(res.error);

        for (let i = 0; i < res.blogs.length; i++)
          createBlog(res.blogs[i]);
      });
    }

    if (event.target.classList.contains('back-button')) {
      document.getElementById('types-title').style.display = 'block';
      document.querySelector('.blog-types-wrapper').style.display = 'block';
      document.getElementById('blogs-title').style.display = 'none';
      document.querySelector('.blogs-wrapper').style.display = 'none';
      document.querySelector('.back-button').style.display = 'none';
    }
  })
})
