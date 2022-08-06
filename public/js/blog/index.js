let blog = null;

function createBlog(blog) {
  const wrapper = document.querySelector('.other-blogs-content');

  const otherBlog = document.createElement('a');
  otherBlog.classList.add('each-other-blog')
  otherBlog.href = '/blog/' + blog.identifier;

  const otherBlogTitle = document.createElement('div');
  otherBlogTitle.classList.add('each-other-blog-title');
  otherBlogTitle.innerHTML = blog.title;
  otherBlog.appendChild(otherBlogTitle);

  const otherBlogSubtitle = document.createElement('div');
  otherBlogSubtitle.classList.add('each-other-blog-subtitle');
  otherBlogSubtitle.innerHTML = blog.subtitle;
  otherBlog.appendChild(otherBlogSubtitle);

  const otherBlogCreatedAt = document.createElement('div');
  otherBlogCreatedAt.classList.add('each-other-blog-created-at');
  otherBlogCreatedAt.innerHTML = blog.created_at;
  otherBlog.appendChild(otherBlogCreatedAt);

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
});
