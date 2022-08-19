const async = require('async');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const validator = require('validator');

const Image = require('../image/Image');
const Project = require('../project/Project');
const Writer = require('../writer/Writer');

const getBlog = require('./functions/getBlog');
const getContent = require('./functions/getContent');
const getIdentifier = require('./functions/getIdentifier');

const language_values = ['en', 'tr', 'ru'];
const type_values = ['node101', 'term', 'project'];

const DATABASE_CREATED_AT_LENGTH = 10;
const DOCUMENT_LIMIT_PER_FIND_QUERY = 1e3;
const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const LANGUAGE_LENGTH = 2;

const DEFAULT_LOGO = '/res/images/blog/node101.png';

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  identifier: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true,
    unique: true,
    index: true
  },
  order: {
    type: Number,
    required: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  writer_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  language: {
    type: String,
    length: LANGUAGE_LENGTH,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  project_id: {
    type: mongoose.Types.ObjectId,
    default: null
  },
  title: {
    type: String,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  subtitle: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  logo: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true,
    default: DEFAULT_LOGO
  },
  image: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true
  },
  created_at: {
    type: String,
    required: true,
    length: DATABASE_CREATED_AT_LENGTH
    // Format: DD.MM.YYYY
  },
  content: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH,
    /*
      FORMAT
      {
        type: ['text', 'code', 'title', 'info', 'image', 'video'],
        content: String
      }
      !!! Videos will be a YouTube link
    */
  },
  view_count: {
    type: Number,
    default: 0
  },
  like_count: {
    type: Number,
    default: 0
  }
});

BlogSchema.statics.createBlog = function (data, callback) {
  const Blog = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.language || !language_values.includes(data.language))
    return callback('bad_request');

  if (!data.title || typeof data.title != 'string' || !data.title.length || data.title.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.subtitle || typeof data.subtitle != 'string' || !data.subtitle.length || data.subtitle.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.type || !type_values.includes(data.type))
    return callback('bad_request');

  if (data.logo) {
    Image.findImageByUrl(data.logo, (err, logo) => {
      if (err) return callback(err);
  
      Image.findImageByUrl(data.image, (err, image) => {
        if (err) return callback(err);
    
        Writer.findWriterById(data.writer_id, (err, writer) => {
          if (err) return callback(err);
    
          if (data.type == 'project') {
            Project.findProjectById(data.project_id, (err, project) => {
              if (err) return callback(err);
    
              Blog.findBlogCountByTypeAndLanguage({
                type: data.type,
                project_id: project._id,
                language: data.language
              }, (err, order) => {
                if (err) return callback(err);
        
                const newBlogData = {
                  identifier: getIdentifier(data.title),
                  order,
                  writer_id: writer._id,
                  language: data.language,
                  type: data.type,
                  project_id: project._id,
                  title: data.title.trim(),
                  subtitle: data.subtitle.trim(),
                  logo: logo.url,
                  image: image.url,
                  created_at: moment().tz('Europe/Istanbul').format('DD[.]MM[.]YYYY'),
                  content: getContent(data.content)
                };
              
                const newBlog = new Blog(newBlogData);
              
                newBlog.save((err, blog) => {
                  if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE) return callback('duplicated_unique_field');
                  if (err) return callback('database_error');
            
                  Image.findImageByUrlAndSetAsUsed(blog.image, err => {
                    if (err) return callback(err);
            
                    return callback(null, blog._id.toString());
                  });  
                });
              });
            });
          } else {
            Blog.findBlogCountByTypeAndLanguage({
              type: data.type,
              language: data.language
            }, (err, order) => {
              if (err) return callback(err);
      
              const newBlogData = {
                identifier: getIdentifier(data.title),
                order,
                writer_id: writer._id,
                language: data.language,
                type: data.type,
                title: data.title.trim(),
                subtitle: data.subtitle.trim(),
                logo: logo.url,
                image: image.url,
                created_at: moment().tz('Europe/Istanbul').format('DD[.]MM[.]YYYY'),
                content: getContent(data.content)
              };
            
              const newBlog = new Blog(newBlogData);
            
              newBlog.save((err, blog) => {
                if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE) return callback('duplicated_unique_field');
                if (err) return callback('database_error');
          
                Image.findImageByUrlAndSetAsUsed(blog.image, err => {
                  if (err) return callback(err);
          
                  return callback(null, blog._id.toString());
                });  
              });
            });
          }
        });
      });
    });
  } else {
    Image.findImageByUrl(data.image, (err, image) => {
      if (err) return callback(err);
  
      Writer.findWriterById(data.writer_id, (err, writer) => {
        if (err) return callback(err);
  
        if (data.type == 'project') {
          Project.findProjectById(data.project_id, (err, project) => {
            if (err) return callback(err);
  
            Blog.findBlogCountByTypeAndLanguage({
              type: data.type,
              project_id: project._id,
              language: data.language
            }, (err, order) => {
              if (err) return callback(err);
      
              const newBlogData = {
                identifier: getIdentifier(data.title),
                order,
                writer_id: writer._id,
                language: data.language,
                type: data.type,
                project_id: project._id,
                title: data.title.trim(),
                subtitle: data.subtitle.trim(),
                image: image.url,
                logo: DEFAULT_LOGO,
                created_at: moment().tz('Europe/Istanbul').format('DD[.]MM[.]YYYY'),
                content: getContent(data.content)
              };
            
              const newBlog = new Blog(newBlogData);
            
              newBlog.save((err, blog) => {
                if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE) return callback('duplicated_unique_field');
                if (err) return callback('database_error');
          
                Image.findImageByUrlAndSetAsUsed(blog.image, err => {
                  if (err) return callback(err);
          
                  return callback(null, blog._id.toString());
                });  
              });
            });
          });
        } else {
          Blog.findBlogCountByTypeAndLanguage({
            type: data.type,
            language: data.language
          }, (err, order) => {
            if (err) return callback(err);
    
            const newBlogData = {
              identifier: getIdentifier(data.title),
              order,
              writer_id: writer._id,
              language: data.language,
              type: data.type,
              title: data.title.trim(),
              subtitle: data.subtitle.trim(),
              image: image.url,
              logo: DEFAULT_LOGO,
              created_at: moment().tz('Europe/Istanbul').format('DD[.]MM[.]YYYY'),
              content: getContent(data.content)
            };
          
            const newBlog = new Blog(newBlogData);
          
            newBlog.save((err, blog) => {
              if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE) return callback('duplicated_unique_field');
              if (err) return callback('database_error');
        
              Image.findImageByUrlAndSetAsUsed(blog.image, err => {
                if (err) return callback(err);
        
                return callback(null, blog._id.toString());
              });  
            });
          });
        }
      });
    });
  }
};

BlogSchema.statics.findBlogById = function (id, callback) {
  const Blog = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Blog.findById(mongoose.Types.ObjectId(id.toString()), (err, blog) => {
    if (err) return callback('database_error');
    if (!blog) return callback('document_not_found');

    return callback(null, blog);
  });
};

BlogSchema.statics.findBlogByIdAndFormat = function (id, callback) {
  const Blog = this;

  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);

    Blog.findBlogByIdAndGetPreviousBlog(blog._id, (err, prev_blog) => {
      if (err) return callback(err);

      Blog.findBlogByIdAndGetNextBlog(blog._id, (err, next_blog) => {
        if (err) return callback(err);
  
        getBlog(blog, (err, blog) => {
          if (err) return callback(err);
    
          blog.previous_blog = prev_blog ? {
            identifier: prev_blog.identifier,
            title: prev_blog.title
          } : null;
          blog.next_blog = next_blog ? {
            identifier: next_blog.identifier,
            title: next_blog.title
          } : null;
    
          return callback(null, blog);
        }); 
      });
    });
  });
};

BlogSchema.statics.findBlogByIdentifierAndLanguage = function (data, callback) {
  const Blog = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.identifier || typeof data.identifier != 'string')
    return callback('bad_request');

  if (!data.language || !language_values.includes(data.language.toString()))
    data.language = 'en';

  data.language = data.language.toString();

  Blog.findOne({
    identifier: data.identifier.trim()
  }, (err, blog) => {
    if (err) return callback('database_error');
    if (!blog) return callback('document_not_found');

    if (blog.language == data.language) {
      Blog.findBlogByIdAndFormat(blog._id, (err, blog) => {
        if (err) return callback(err);
  
        return callback(null, blog);
      });
    } else {
      Project.findProjectByIdAndGetEquivalanceInGivenLanguage(blog.project_id, data.language, (err, project) => {
        if (err && err != 'document_not_found')
          return callback(err);

        if (err) {
          Blog.findBlogByIdAndFormat(blog._id, (err, blog) => {
            if (err) return callback(err);
      
            return callback(null, blog);
          });
        } else {
          Blog.findOne({
            order: blog.order,
            type: blog.type,
            project_id: project._id,
            language: data.language
          }, (err, new_blog) => {
            if (err) return callback('database_error');
    
            if (!new_blog) {
              Blog.findBlogByIdAndFormat(blog._id, (err, blog) => {
                if (err) return callback(err);
          
                return callback(null, blog);
              });
            } else {
              Blog.findBlogByIdAndFormat(new_blog._id, (err, blog) => {
                if (err) return callback(err);
          
                return callback(null, blog);
              });
            }
          });
        }
      });
    }
  });
};

BlogSchema.statics.findBlogCountByTypeAndLanguage = function (data, callback) {
  const Blog = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.language || !language_values.includes(data.language))
    return callback('bad_request');

  if (!data.type || !type_values.includes(data.type))
    return callback('bad_request');

  if (data.type == 'project') {
    Project.findProjectById(data.project_id, (err, project) => {
      if (err) return callback(err);

      Blog
        .find({
          type: data.type,
          project_id: project._id,
          language: data.language,
          is_deleted: { $ne: true } 
        })
        .countDocuments()
        .then(number => callback(null, number))
        .catch(err => callback('database_error'));
    });
  } else {
    Blog
      .find({
        type: data.type,
        language: data.language,
        is_deleted: { $ne: true } 
      })
      .countDocuments()
      .then(number => callback(null, number))
      .catch(err => callback('database_error'));
  }
};

BlogSchema.statics.findAllBlogs = function (callback) {
  const Blog = this;

  Blog
    .find({ is_deleted: { $ne: true } })
    .sort({ name: 1 })
    .then(blocks => callback(null, blocks))
    .catch(err => callback('database_error'));
};

BlogSchema.statics.getTypesWithBlogsByLanguage = function (language, callback) {
  const Blog = this;

  if (!language || !language_values.includes(language))
    return callback('bad_request');

  Blog.find({
    language,
    is_deleted: { $ne: true }
  }, (err, blogs) => {
    if (err) return callback('database_error');
    const types = [];

    async.timesSeries(
      blogs.length,
      (time, next) => {
        const blog = blogs[time];

        if (types.find(each => each._id == blog.type)) {
          types.find(each => each._id == blog.type).count++;
          return next(null);
        }

        if (blog.type != 'project') {
          types.push({
            _id: blog.type,
            name: blog.type,
            image: `/res/images/blog/${blog.type}.png`,
            count: 1
          });
          return next(null)
        }

        Project.findProjectById(blog.project_id, (err, project) => {
          if (err) return next(err);

          if (types.find(each => each.name == project.name)) {
            types.find(each => each.name == project.name).count++;
            return next(null);
          }

          types.push({
            _id: project._id.toString(),
            name: project.name,
            image: project.image,
            count: 1
          });

          return next(null)
        });
      },
      err => {
        if (err) return callback(err);

        return callback(null, types);
      }
    );
  });
};

BlogSchema.statics.findBlogsByTypeAndLanguage = function (data, callback) {
  const Blog = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.language || !language_values.includes(data.language))
    return callback('bad_request');

  if (!data.type || !type_values.includes(data.type))
    return callback('bad_request');

  if (data.type == 'project') {
    Project.findProjectById(data.project_id, (err, project) => {
      if (err) return callback(err);

      Blog
        .find({
          type: data.type,
          project_id: project._id,
          language: data.language,
          is_deleted: { $ne: true } 
        })
        .then(blogs => async.timesSeries(
          blogs.length,
          (time, next) => Blog.findBlogByIdAndFormat(blogs[time]._id, (err, blog) => next(err, blog)),
          (err, blogs) => {
            if (err) return callback(err);

            return callback(null, blogs);
          }
        ))
        .catch(err => callback('database_error'));
    });
  } else {
    Blog
      .find({
        type: data.type,
        language: data.language,
        is_deleted: { $ne: true } 
      })
      .then(blogs => async.timesSeries(
        blogs.length,
        (time, next) => Blog.findBlogByIdAndFormat(blogs[time]._id, (err, blog) => next(err, blog)),
        (err, blogs) => {
          if (err) return callback(err);

          return callback(null, blogs);
        }
      ))
      .catch(err => callback('database_error'));
  }
};

BlogSchema.statics.findBlogByIdAndGetPreviousBlog = function (id, callback) {
  const Blog = this;
  
  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);

    Blog.findOne({
      type: blog.type,
      project_id: blog.project_id,
      language: blog.language,
      order: blog.order - 1
    }, (err, blog) => {
      if (err) return callback('database_error');
      
      return callback(null, blog);
    });
  });
};

BlogSchema.statics.findBlogByIdAndGetNextBlog = function (id, callback) {
  const Blog = this;
  
  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);

    Blog.findOne({
      type: blog.type,
      project_id: blog.project_id,
      language: blog.language,
      order: blog.order + 1
    }, (err, blog) => {
      if (err) return callback('database_error');
      
      return callback(null, blog);
    });
  });
};

BlogSchema.statics.findBlogByIdAndUpdate = function (id, data, callback) {
  const Blog = this;

  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);

    const update = {
      title: data.title && typeof data.title == 'string' && data.title.trim().length && data.title.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.title.trim() : blog.title,
      subtitle: data.subtitle && typeof data.subtitle == 'string' && data.subtitle.trim().length && data.subtitle.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.subtitle.trim() : blog.subtitle,
      content: getContent(data.content)
    }
   
    update.identifier = getIdentifier(update.title);

    Blog.findByIdAndUpdate(blog._id, {$set: update}, { new: true }, (err, blog) => {
      if (err) return callback('database_error');

      return callback(null, blog.identifier);
    });
  });
};

BlogSchema.statics.checkIfImageIsUsed = function (url, callback) {
  const Blog = this;

  if (!url || typeof url != 'string')
    return callback('bad_request');

  Blog.findOne({$or: [
    { logo: url.trim() },
    { image: url.trim() }
  ]}, (err, blog) => {
    if (err)
      return callback('database_error');
    if (!blog)
      return callback(null, false);
    return callback(null, true);
  });
};

BlogSchema.statics.findBlogByIdAndUpdateImage = function (id, data, callback) {
  const Blog = this;

  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);

    Image.findImageByUrl(data.image, (err, image) => {
      if (err) return callback(err);

      Blog.findByIdAndUpdate(blog._id, {$set: {
        image: image.url
      }}, err => {
        if (err) return callback('database_error');

        Image.findImageByUrlAndSetAsUsed(image.url, err => {
          if (err) return callback(err);

          Blog.checkIfImageIsUsed(blog.image, (err, res) => {
            if (err) return callback(err);
            if (res) return callback(null); // Another blog is using the image

            Image.findImageByUrlAndDelete(blog.image, err => {
              if (err) return callback(err);
      
              return callback(null); 
            });
          });
        });
      });
    });
  });
};

BlogSchema.statics.findBlogByIdAndUpdateLogo = function (id, data, callback) {
  const Blog = this;

  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);

    Image.findImageByUrl(data.logo, (err, logo) => {
      if (err) return callback(err);

      Blog.findByIdAndUpdate(blog._id, {$set: {
        logo: logo.url
      }}, err => {
        if (err) return callback('database_error');

        Image.findImageByUrlAndSetAsUsed(logo.url, err => {
          if (err) return callback(err);

          if (blog.logo == DEFAULT_LOGO)
            return callback(null);

          Blog.checkIfImageIsUsed(blog.logo, (err, res) => {
            if (err) return callback(err);
            if (res) return callback(null); // Another blog is using the image

            Image.findImageByUrlAndDelete(blog.logo, err => {
              if (err) return callback(err);
      
              return callback(null); 
            });
          });
        });
      });
    });
  });
};

BlogSchema.statics.findBlogByIdAndIncreaseOrder = function (id, callback) {
  const Blog = this;

  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);
    if (!blog.order)
      return callback('bad_request');

    Blog.findBlogByIdAndGetPreviousBlog(blog._id, (err, prev_blog) => {
      if (err) return callback(err);

      Blog.findByIdAndUpdate(prev_blog._id, {$inc: {
        order: 1
      }}, err => {
        if (err) return callback('database_error');

        Blog.findByIdAndUpdate(blog.id, {$inc: {
          order: -1
        }}, err => {
          if (err) return callback('database_error');

          return callback(null);
        });
      });
    });
  });
};

BlogSchema.statics.findDeletedBlogs = function (callback) {
  const Blog = this;

  Blog.find({
    is_deleted: true
  }, (err, blogs) => {
    if (err) return callback('database_error');

    return callback(null, blogs);
  });
};

BlogSchema.statics.findBlogByIdAndDelete = function (id, callback) {
  const Blog = this;

  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);
    if (blog.is_deleted)
      return callback(null);

    Blog.findByIdAndUpdate(blog._id, {$set: {
      identifier: blog.identifier + '_' + blog._id.toString(), // Used to prevent identifier duplicates with deleted blogs
      is_deleted: true,
      order: -1 // Order is destroyed to prevent errors in order update
    }}, err => {
      if (err) return callback('database_error');

      Blog.find({
        type: blog.type,
        project_id: blog.project_id,
        language: blog.language,
        order: { $gt: blog.order },
        is_deleted: { $ne: true }
      }, (err, blogs) => {
        if (err) return callback('database_error');

        async.timesSeries(
          blogs.length,
          (time, next) => Blog.findByIdAndUpdate(blogs[time]._id, {$inc: {
            order: -1
          }}, err => next(err)),
          err => {
            if (err) return callback('database_error');

            return callback(null);
          }
        );
      });
    });
  });
};

BlogSchema.statics.findBlogByIdAndRestore = function (id, callback) {
  const Blog = this;

  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);
    if (!blog.is_deleted)
      return callback('bad_request');

      Blog.findBlogCountByTypeAndLanguage({
        type: blog.type,
        project_id: blog.type == 'project' ? blog.project_id : null,
        language: blog.language
      }, (err, order) => {
        if (err) return callback(err);

        Blog.findByIdAndUpdate(blog._id, {
          identifier: blog.identifier.replace('_' + blog._id.toString(), ''),
          is_deleted: false,
          order
        }, err => {
          if (err) return callback('database_error');

          return callback(null);
        });
      });
  })
};

module.exports = mongoose.model('Blog', BlogSchema);
