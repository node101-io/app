const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Image = require('../image/Image');

const getGuide = require('./functions/getGuide');
const getProject = require('./functions/getProject');
const getRequirements = require('./functions/getRequirements');

const language_values = ['en', 'tr', 'ru'];
const status_values = ['active', 'upcoming', 'ended'];
const popularity_values = ['low', 'medium', 'high'];

const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const LANGUAGE_LENGTH = 2;
const DOCUMENT_LIMIT_FOR_FIND_QUERY = 20;

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  is_active: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    length: LANGUAGE_LENGTH,
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  image: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true
  },
  created_at: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  guide: {
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
  requirements: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH,
    /*
      FORMAT
      {
        name: String,
        content: String
      }
    */
  },
  status: {
    type: String,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  dates: {
    type: String,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  is_stakable: {
    type: Boolean,
    default: false
  },
  stake_url: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  reward: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  get_involved_url: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  popularity: {
    type: String,
    required: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  }
});

ProjectSchema.statics.createProject = function (data, callback) {
  const Project = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.language || !language_values.includes(data.language))
    return callback('bad_request');

  if (!data.name || typeof data.name != 'string' || !data.name.length || data.name.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.description || typeof data.description != 'string' || !data.description.length || data.description.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.dates || typeof data.dates != 'string' || !data.dates.length || data.dates.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.reward || typeof data.reward != 'string' || !data.reward.length || data.reward.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.status || !status_values.includes(data.status))
    return callback('bad_request');

  if (!data.popularity || !popularity_values.includes(data.popularity))
    return callback('bad_request');

  Image.findImageByUrl(data.image, (err, image) => {
    if (err) return callback(err);

    const newProjectData = {
      is_active: data.is_active ? true : false,
      language: data.language,
      name: data.name.trim(),
      image: image.url,
      created_at: parseInt((new Date()).getTime()),
      description: data.description.trim(),
      guide: getGuide(data.guide),
      requirements: getRequirements(data.requirements),
      status: data.status,
      dates: data.dates.trim(),
      is_stakable: data.stake_url && validator.isURL(data.stake_url.toString()) ? true : false,
      stake_url: data.stake_url && validator.isURL(data.stake_url.toString()) ? data.stake_url.toString() : null,
      reward: data.reward.trim(),
      get_involved_url: data.get_involved_url && validator.isURL(data.get_involved_url.toString()) ? data.get_involved_url.toString() : null,
      popularity: data.popularity
    };
  
    const newProject = new Project(newProjectData);
  
    newProject.save((err, project) => {
      if (err) return callback('database_error');

      Image.findImageByUrlAndSetAsUsed(project.image, err => {
        if (err) return callback(err);

        return callback(null, project._id.toString());
      });  
    });
  });
};

ProjectSchema.statics.findProjectById = function (id, callback) {
  const Project = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Project.findById(mongoose.Types.ObjectId(id.toString()), (err, project) => {
    if (err) return callback('database_error');
    if (!project) return callback('document_not_found');

    return callback(null, project);
  });
};

ProjectSchema.statics.findProjectByIdAndFormat = function (id, callback) {
  const Project = this;

  Project.findProjectById(id, (err, project) => {
    if (err) return callback(err);

    getProject(project, (err, project) => {
      if (err) return callback(err);

      return callback(null, project);
    });
  });
};

ProjectSchema.statics.findProjectsByFilters = function (data, callback) {
  const Project = this;

  const filters = {};
  const limit = data.limit && Number.isInteger(data.limit) && data.limit > 0 && data.limit <= DOCUMENT_LIMIT_FOR_FIND_QUERY ? data.limit : DOCUMENT_LIMIT_FOR_FIND_QUERY;

  if (data.nin_id_list && !data.nin_id_list.find(each => !validator.isMongoId(each.toString())))
    filters._id = { $nin: data.nin_id_list.map(each => mongoose.Types.ObjectId(each.toString())) };

  if ('is_active' in data)
    filters.is_active = data.is_active ? true : false;

  if (data.language && language_values.includes(data.language))
    filters.language = data.language;

  if (data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.name = data.name.trim().toLowerCase();

  if (data.status && typeof data.status == 'string' && status_values.includes(data.status))
    filters.status = data.status;

  if (data.status && Array.isArray(data.status) && !data.status.find(each => !status_values.includes(each)))
    filters.status = { $in: data.status };

  if (data.popularity && typeof data.popularity == 'string' && popularity_values.includes(data.popularity))
    filters.popularity = data.popularity;

  if (data.popularity && Array.isArray(data.popularity) && !data.popularity.find(each => !popularity_values.includes(each)))
    filters.popularity = { $in: data.popularity };

  Project
    .find(filters)
    .sort({ _id: -1 })
    .limit(limit)
    .then(projects => async.timesSeries(
      projects.length,
      (time, next) => getProject(projects[time], (err, project) => next(err, project)),
      (err, projects) => callback(err, projects)
    ))
    .catch(err => callback('database_error'));
};

ProjectSchema.statics.findProjectByIdAndUpdate = function (id, data, callback) {
  const Project = this;

  Project.findProjectById(id, (err, project) => {
    if (err) return callback(err);

    Project.findByIdAndUpdate(project._id, {$set: {
      is_active: 'is_active' in data ? (data.is_active ? true : false) : project.is_active,
      language: data.language && language_values.includes(data.language) ? data.language : project.language,
      name: data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.name.trim() : project.name,
      name: data.description && typeof data.description == 'string' && data.description.trim().length && data.description.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.description.trim() : project.description,
      guide: getGuide(data.guide),
      requirements: getRequirements(data.requirements),
      status: data.status && status_values.includes(data.status) ? data.status : project.status,
      dates: data.dates && typeof data.dates == 'string' && data.dates.trim().length && data.dates.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.dates.trim() : project.dates,
      is_stakable: data.stake_url && validator.isURL(data.stake_url.toString()) ? true : project.is_stakable,
      stake_url: data.stake_url && validator.isURL(data.stake_url.toString()) ? data.stake_url.toString() : project.stake_url,
      reward: data.reward && typeof data.reward == 'string' && data.reward.trim().length && data.reward.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.reward.trim() : project.reward,
      get_involved_url: data.get_involved_url && validator.isURL(data.get_involved_url.toString()) ? data.get_involved_url.toString() : project.get_involved_url,
      popularity: data.popularity && popularity_values.includes(data.popularity) ? data.popularity : project.popularity
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

ProjectSchema.statics.findProjectByIdAndUpdateImage = function (id, data, callback) {
  const Project = this;

  Project.findProjectById(id, (err, project) => {
    if (err) return callback(err);

    Image.findImageByUrl(data.image, (err, image) => {
      if (err) return callback(err);

      Image.findImageByUrlAndDelete(project.image, err => {
        if (err) return callback(err);

        Project.findByIdAndUpdate(project._id, {$set: {
          image: image.url
        }}, err => {
          if (err) return callback('database_error');

          Image.findImageByUrlAndSetAsUsed(image.url, err => {
            if (err) return callback('database_error');

            return callback(null);
          });
        });
      });
    });
  });
};

module.exports = mongoose.model('Project', ProjectSchema);
