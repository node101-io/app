const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Image = require('../image/Image');

const fetchStakeRate = require('./functions/fetchStakeRate');
const getGuide = require('./functions/getGuide');
const getLinks = require('./functions/getLinks');
const getProject = require('./functions/getProject');
const getRequirements = require('./functions/getRequirements');

const language_values = ['en', 'tr', 'ru'];
const status_values = ['active', 'upcoming', 'ended'];
const popularity_values = ['low', 'medium', 'high'];

const DEFAULT_STAKE_RATE_UPDATE_TIME_IN_MS = 5 * 60 * 1000;
const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const DOCUMENT_LIMIT_FOR_FIND_QUERY = 20;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const LANGUAGE_LENGTH = 2;

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
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
  },
  links: {
    type: Object,
    default: {
      web: null,
      github: null,
      telegram: null,
      medium: null,
      twitter: null,
      instagram: null,
      gitbook: null,
      docs: null,
      explorer: null
    }
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
  stake_api_title: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  stake_rate: {
    type: Number,
    default: null
  },
  last_stake_rate_update_time_in_ms: {
    type: Number,
    default: null
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

    const is_stakable = data.stake_url && validator.isURL(data.stake_url.toString()) && data.stake_api_title && typeof data.stake_api_title == 'string' ? true : false;

    if (is_stakable) {
      fetchStakeRate(data.stake_api_title.toString(), (err, stake_rate) => {
        if (err) return callback(err);

        const newProjectData = {
          identifier: data.name.split(' ').join('_').toLowerCase().trim() + (data.language != 'en' ? ('_' + data.language) : ''),
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
          reward: data.reward.trim(),
          get_involved_url: data.get_involved_url && validator.isURL(data.get_involved_url.toString()) ? data.get_involved_url.toString() : null,
          popularity: data.popularity,
          links: getLinks(data.links),
          is_stakable,
          stake_url: data.stake_url.toString(),
          stake_api_title: data.stake_api_title.toString(),
          stake_rate,
          last_stake_rate_update_time_in_ms: parseInt((new Date()).getTime())
        };
      
        const newProject = new Project(newProjectData);
      
        newProject.save((err, project) => {
          console.log(err);
          if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE) return callback('duplicated_unique_field');
          if (err) return callback('database_error');
    
          Image.findImageByUrlAndSetAsUsed(project.image, err => {
            if (err) return callback(err);
    
            return callback(null, project._id.toString());
          });  
        });
      });
    } else {
      const newProjectData = {
        identifier: data.name.split(' ').join('_').toLowerCase().trim() + (data.language != 'en' ? ('_' + data.language) : ''),
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
        reward: data.reward.trim(),
        get_involved_url: data.get_involved_url && validator.isURL(data.get_involved_url.toString()) ? data.get_involved_url.toString() : null,
        popularity: data.popularity,
        links: getLinks(data.links),
        is_stakable: false
      };
    
      const newProject = new Project(newProjectData);
    
      newProject.save((err, project) => {
        console.log(err);
        if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE) return callback('duplicated_unique_field');
        if (err) return callback('database_error');
  
        Image.findImageByUrlAndSetAsUsed(project.image, err => {
          if (err) return callback(err);
  
          return callback(null, project._id.toString());
        });  
      });
    }
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

ProjectSchema.statics.findProjectByIdentifier = function (identifier, callback) {
  const Project = this;

  if (!identifier || typeof identifier != 'string')
    return callback('bad_request');

  Project.findOne({
    identifier: identifier.trim()
  }, (err, project) => {
    if (err) return callback('database_error');
    if (!project) return callback('document_not_found');

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

    const is_stakable = data.stake_url && validator.isURL(data.stake_url.toString()) && data.stake_api_title && typeof data.stake_api_title == 'string' ? true : false;

    if (is_stakable) {
      fetchStakeRate(data.stake_api_title.toString(), (err, stake_rate) => {
        if (err) return callback(err);

        Project.findByIdAndUpdate(project._id, {$set: {
          language: data.language && language_values.includes(data.language) ? data.language : project.language,
          name: data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.name.trim() : project.name,
          description: data.description && typeof data.description == 'string' && data.description.trim().length && data.description.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.description.trim() : project.description,
          guide: getGuide(data.guide),
          requirements: getRequirements(data.requirements),
          status: data.status && status_values.includes(data.status) ? data.status : project.status,
          dates: data.dates && typeof data.dates == 'string' && data.dates.trim().length && data.dates.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.dates.trim() : project.dates,
          reward: data.reward && typeof data.reward == 'string' && data.reward.trim().length && data.reward.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.reward.trim() : project.reward,
          get_involved_url: data.get_involved_url && validator.isURL(data.get_involved_url.toString()) ? data.get_involved_url.toString() : project.get_involved_url,
          popularity: data.popularity && popularity_values.includes(data.popularity) ? data.popularity : project.popularity,
          links: getLinks(data.links),
          is_stakable: true,
          stake_url: data.stake_url.toString(),
          stake_api_title: data.stake_api_title.toString(),
          stake_rate,
          last_stake_rate_update_time_in_ms: parseInt((new Date()).getTime())
        }}, { new: true }, (err, project) => {
          if (err) return callback('database_error');
    
          Project.findByIdAndUpdate(project._id, {$set: {
            identifier: project.name.split(' ').join('_').toLowerCase().trim() + (project.language != 'en' ? ('_' + project.language) : ''),
          }}, err => {
            if (err) return callback('database_error');
    
            return callback(null);
          });
        });
      });
    } else {
      Project.findByIdAndUpdate(project._id, {$set: {
        language: data.language && language_values.includes(data.language) ? data.language : project.language,
        name: data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.name.trim() : project.name,
        description: data.description && typeof data.description == 'string' && data.description.trim().length && data.description.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.description.trim() : project.description,
        guide: getGuide(data.guide),
        requirements: getRequirements(data.requirements),
        status: data.status && status_values.includes(data.status) ? data.status : project.status,
        dates: data.dates && typeof data.dates == 'string' && data.dates.trim().length && data.dates.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.dates.trim() : project.dates,
        reward: data.reward && typeof data.reward == 'string' && data.reward.trim().length && data.reward.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.reward.trim() : project.reward,
        get_involved_url: data.get_involved_url && validator.isURL(data.get_involved_url.toString()) ? data.get_involved_url.toString() : project.get_involved_url,
        popularity: data.popularity && popularity_values.includes(data.popularity) ? data.popularity : project.popularity,
        links: getLinks(data.links),
        is_stakable: false,
        stake_url: null,
        stake_api_title: null
      }}, { new: true }, (err, project) => {
        if (err) return callback('database_error');
  
        Project.findByIdAndUpdate(project._id, {$set: {
          identifier: project.name.split(' ').join('_').toLowerCase().trim() + (project.language != 'en' ? ('_' + project.language) : ''),
        }}, err => {
          if (err) return callback('database_error');
  
          return callback(null);
        });
      });
    }
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

ProjectSchema.statics.findProjectByIdAndReverseStatus = function (id, callback) {
  const Project = this;

  Project.findProjectById(id, (err, project) => {
    if (err) return callback(err);

    Project.findByIdAndUpdate(project._id, {$set: {
      is_active: !project.is_active
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

ProjectSchema.statics.findStakableProjects = function (data, callback) {
  const Project = this;

  if (!data || !data.language || !language_values.includes(data.language))
    return callback('bad_request')

  Project
    .find({
      is_active: true,
      language: data.language,
      is_stakable: true
    })
    .sort({ _id: -1 })
    .then(projects => async.timesSeries(
      projects.length,
      (time, next) => {
        Project.findProjectByIdAndUpdateStakeRate(projects[time]._id, (err, stake_rate) => {
          if (err)
            console.log(err);
          else
            projects[time].stake_rate = stake_rate;

          getProject(projects[time], (err, project) => {
            if (err) return next(err);

            return next(null, project);
          });
        });
      },
      (err, projects) => {
        if (err) return callback(err);

        return callback(null, projects);
      }
    ))
    .catch(err => callback('database_error'));
};

ProjectSchema.statics.findProjectByIdAndUpdateStakeRate = function (id, callback) {
  const Project = this;

  Project.findProjectById(id, (err, project) => {
    if (err) return callback(err);

    if (!project.is_stakable)
      return callback('bad_request');

    if (project.last_stake_rate_update_time_in_ms && project.last_stake_rate_update_time_in_ms + DEFAULT_STAKE_RATE_UPDATE_TIME_IN_MS >= (new Date()).getTime())
      return callback(null, project.stake_rate);

    fetchStakeRate(project.stake_api_title, (err, stake_rate) => {
      if (err) return callback(err);

      Project.findByIdAndUpdate(project._id, {$set: {
        stake_rate,
        last_stake_rate_update_time_in_ms: parseInt((new Date()).getTime())
      }}, { new: true }, (err, project) => {
        if (err) return callback('database_error');

        return callback(null, project.stake_rate);
      });
    });
  });
};

module.exports = mongoose.model('Project', ProjectSchema);
