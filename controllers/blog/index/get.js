const Blog = require('../../../models/blog/Blog');

module.exports = (req, res) => {
  const identifier = req.originalUrl.replace('/blog/', '');
  const page_lang = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  return res.render('blog/index', {
    page: 'blog/index',
    title: 'HERE',
    includes: {
      external: {
        css: ['confirm', 'footer', 'general', 'header', 'page'],
        js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
      }
    },
    url: '/blog/' + identifier,
    lang: req.query.lang,
    page_lang,
    blog: {
      _id: '0000000000000',
      identifier: 'what_is_staking',
      writer: {
        name: 'Yunus Gürlek',
        image: 'https://node101.s3.amazonaws.com/d26fa891d50cfd879eabecbb16eed027',
        position: 'Lead Programmer & Head of Product',
        links: {
          github: 'https://github.com/yunus433',
          telegram: 'https://github.com/yunus433',
          medium: 'https://github.com/yunus433',
          twitter: 'https://github.com/yunus433',
          instagram: 'https://github.com/yunus433',
          discord: 'https://github.com/yunus433',
        }
      },
      language: 'en',
      title: 'What is staking?',
      subtitle: 'Learn what is staking and how to stake.',
      type: 'project',
      project: {
        image: 'https://usersmagic.s3.amazonaws.com/201e45030037a3b7c76def26e74628bb',
        name: 'Umee'
      },
      created_at: '07.08.2022',
      image: 'https://node101.s3.amazonaws.com/68a62fa4adf1700d90ffed40526ce35e',
      content: [
        {
          type: 'title',
          content: 'Title One'
        },
        {
          type: 'text',
          content: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914.'
        },
        {
          type: 'image',
          content: 'https://node101.s3.amazonaws.com/68a62fa4adf1700d90ffed40526ce35e'
        },
        {
          type: 'title',
          content: 'Title Two and More'
        },
        {
          type: 'text',
          content: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'
        }
      ],
      view_count: 0,
      like_count: 0,
      previous_blog: {
        identifier: 'what_is_a_node',
        title: 'What is a node?'
      },
      next_blog: {
        identifier: 'what_is_a_validator',
        title: 'What is a validator?'
      }
    }
  });
}
