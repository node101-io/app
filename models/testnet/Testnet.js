const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Project = require('../project/Project');
const Image = require('../image/Image');

const getGuide = require('./functions/getGuide');
const getLinks = require('./functions/getLinks');
const getTestnet = require('./functions/getTestnet');
const getRequirements = require('./functions/getRequirements');
const getVersion = require('./functions/getVersion');

const language_values = ['en', 'tr', 'ru'];

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const DOCUMENT_LIMIT_PER_FIND_QUERY = 100;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const LANGUAGE_LENGTH = 2;

const Schema = mongoose.Schema;

const TestnetSchema = new Schema({
  project_id: {
    type: String,
    required: true,
    index: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  order: {
    type: Number,
    required: true,
    default: 1
  },
  version: {
    type: Number,
    default: 1
  },
  is_deleted: {
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
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
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
  testnet_url: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  get_involved_url: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
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
      discord: null,
      explorer: null
    }
  }
});

TestnetSchema.statics.createTestnet = function (data, callback) {
  const Testnet = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');
  
  if (!data.project_id || !data.name ) {
    return callback('bad_request');
  }
  const project = Project.findById(mongoose.Types.ObjectId(data.project_id.toString()), (err, project) => {
      if (err) return callback('database_error');
      if (!project) return callback('document_not_found');

        if (!project.language || !language_values.includes(project.language))
    
        if (!data.name || typeof data.name != 'string' || !data.name.length || data.name.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    
        if (!project.description || typeof project.description != 'string' || !project.description.length || project.description.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
      console.log("check")
        Image.findImageByUrl(project.image, (err, image) => {
          if (err) return callback(err);
              const newTestnetData = {
                project_id: data.project_id,
                version: null,
                is_active: project.is_active ? true : false,
                language: project.language,
                name: data.name.trim(),
                image: image.url,
                created_at: parseInt((new Date()).getTime()),
                description: project.description.trim(),
                guide: getGuide(data.guide),
                requirements: getRequirements(data.requirements),
                status: project.status,
                dates: project.dates.trim(),
                reward: project.reward.trim(),
                testnet_url:  data.testnet_url && validator.isURL(data.testnet_url.toString()) ? data.testnet_url.toString() : null,
                get_involved_url: data.get_involved_url && validator.isURL(data.get_involved_url.toString()) ? data.get_involved_url.toString() : null,
                popularity: project.popularity,
                links: project.links,
              };
              console.log("here maybe?")
              const newTestnet = new Testnet(newTestnetData);
            console.log("here we are")
              newTestnet.save((err, testnet) => {
                if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE) return callback('duplicated_unique_field');
                console.log(err)
                if (err) return callback('database_error');
              });
            
          
        });
  });
  
};

TestnetSchema.statics.findTestnetById = function (id, callback) {
  const Testnet = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Testnet.findById(mongoose.Types.ObjectId(id.toString()), (err, testnet) => {
    if (err) return callback('database_error');
    if (!testnet) return callback('document_not_found');

    return callback(null, testnet);
  });
};

TestnetSchema.statics.findStakeByIdAndFormat = function (id, callback) {
  const Testnet = this;

  Testnet.findTestnetById(id, (err, testnet) => {
    if (err) return callback(err);

    getTestnet(testnet, (err, testnet) => {
      if (err) return callback(err);

      return callback(null, testnet);
    });
  });
};

TestnetSchema.statics.findTestnetByIdAndUpdate = function (id, data, callback) {
  const Testnet = this;

  Testnet.findTestnetById(id, (err, testnet) => {
    if (err) return callback(err);

      const update = {
        name: data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.name.trim() : testnet.name,
        guide: getGuide(data.guide),
        requirements: getRequirements(data.requirements),
        status: data.status && status_values.includes(data.status) ? data.status : testnet.status,
        get_involved_url: data.get_involved_url && validator.isURL(data.get_involved_url.toString()) ? data.get_involved_url.toString() : testnet.get_involved_url,
        will_be_stakable: data.will_be_stakable ? true : (testnet.will_be_stakable ? true : false),
        popularity: data.popularity && popularity_values.includes(data.popularity) ? data.popularity : testnet.popularity,
        links: getLinks(data.links),
        stake_url: null,
        stake_api_title: null
      };
      
      update.identifier = update.name.split(' ').join('_').toLowerCase().trim() + (testnet.language != 'en' ? ('_' + testnet.language) : '');

      Testnet.findByIdAndUpdate(testnet._id, {$set: update}, err => {
        if (err) return callback('database_error');
  
        return callback(null);
      });
  });
};

TestnetSchema.statics.findDeletedTestnets = function (callback) {
  const Testnet = this;

  Testnet.find({
    is_deleted: true
  }, (err, testnets) => {
    if (err) return callback('database_error');

    return callback(null, testnets);
  });
};

TestnetSchema.statics.findTestnetByIdAndDelete = function (id, callback) {
  const Testnet = this;

  Testnet.findTestnetById(id, (err, testnet) => {
    if (err) return callback(err);
    if (testnet.is_deleted)
      return callback(null);

    Testnet.findByIdAndUpdate(testnet._id, {$set: {
      identifier: testnet.identifier + '_' + testnet._id.toString(), // Used to prevent identifier duplicates with deleted projects
      is_deleted: true,
      order: -1 // Order is destroyed to prevent errors in order update
    }}, err => {
      if (err) return callback('database_error');

      Testnet.find({
        language: testnet.language,
        order: { $gt: testnet.order },
        is_deleted: { $ne: true }
      }, (err, testnets) => {
        if (err) return callback('database_error');

        async.timesSeries(
          testnets.length,
          (time, next) => Testnet.findByIdAndUpdate(testnets[time]._id, {$inc: {
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

TestnetSchema.statics.findTestnetByIdAndRestore = function (id, callback) {
  const Testnet = this;

  Testnet.findTestnetById(id, (err, testnet) => {
    if (err) return callback(err);
    if (!testnet.is_deleted)
      return callback('bad_request');

      Testnet.findTestnetCountByLanguage(testnet.language, (err, order) => {
        if (err) return callback(err);

        Testnet.findByIdAndUpdate(testnet._id, {
          identifier: testnet.identifier.replace('_' + testnet._id.toString(), ''),
          is_deleted: false,
          is_active: false, // Restore project inactive by default
          order
        }, err => {
          if (err) return callback('database_error');

          return callback(null);
        });
      });
  })
};

module.exports = mongoose.model('Testnet', TestnetSchema);
