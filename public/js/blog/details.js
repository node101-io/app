let blog = null;

function createBlog(_blog) {
  const wrapper = document.querySelector('.other-blogs-content');

  const otherBlog = document.createElement('a');
  otherBlog.classList.add('each-other-blog');
  if (_blog._id.toString() == blog._id.toString())
    otherBlog.classList.add('each-other-blog-selected');
  otherBlog.href = '/blog/' + _blog.identifier + (language ? '?lang=' + language : '');

  const otherBlogLogo = document.createElement('div');
  otherBlogLogo.classList.add('each-other-blog-logo');
  otherBlogLogo.style.backgroundImage = `url(${_blog.logo})`;
  otherBlog.appendChild(otherBlogLogo);

  const otherBlogInfo = document.createElement('div');
  otherBlogInfo.classList.add('each-other-blog-info-wrapper');

  const otherBlogTitle = document.createElement('div');
  otherBlogTitle.classList.add('each-other-blog-title');
  otherBlogTitle.innerHTML = _blog.title;
  otherBlogInfo.appendChild(otherBlogTitle);

  const otherBlogSubtitle = document.createElement('div');
  otherBlogSubtitle.classList.add('each-other-blog-subtitle');
  otherBlogSubtitle.innerHTML = _blog.subtitle;
  otherBlogInfo.appendChild(otherBlogSubtitle);

  const otherBlogCreatedAt = document.createElement('div');
  otherBlogCreatedAt.classList.add('each-other-blog-created-at');
  otherBlogCreatedAt.innerHTML = _blog.created_at;
  otherBlogInfo.appendChild(otherBlogCreatedAt);

  otherBlog.appendChild(otherBlogInfo);

  wrapper.appendChild(otherBlog);
}

function loadSimilarBlogs() {
  serverRequest('/blog/filter', 'POST', {
    type: blog.type,
    project_id: blog.project ? blog.project._id : null,
    language: blog.language
  }, res => {
    if (!res.success)
      return alert(res.error);

    const wrapper = document.querySelector('.other-blogs-content');
    wrapper.innerHTML = '';

    for (let i = 0; i < res.blogs.length; i++)
      createBlog(res.blogs[i]);
  });
}

window.addEventListener('load', () => {
  blog = JSON.parse(document.getElementById('blog-json').value);

  loadSimilarBlogs();

  const windowWidth = window.innerWidth;
  const progressBar = document.querySelector('.blog-progress-bar');

  document.querySelector('.all-wrapper').addEventListener('scroll', event => {
    progressBar.style.width = (event.target.scrollTop / (event.target.scrollHeight - window.innerHeight) * windowWidth) + 'px';
  });
});
