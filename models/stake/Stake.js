const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Image = require('../image/Image');

const fetchAPRandMarketPrice = require('./functions/fetchAPRandMarketPrice');
const getStake = require('./functions/getStake');

const language_values = ['en', 'tr', 'ru'];

const DEFAULT_UPDATE_TIME_IN_MS = 5 * 60 * 1000;
const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const LANGUAGE_LENGTH = 2;

const Schema = mongoose.Schema;

const StakeSchema = new Schema({
  order: {
    type: Number,
    required: true
  },
  is_stakable: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: false
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
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true
  },
  stake_url: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  how_to_stake_url: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  apr: {
    type: Number,
    default: null
  },
  market_price: {
    type: Number,
    default: null
  },
  apr_api_url: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  market_price_api_url: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  last_update_time_in_ms: {
    type: Number,
    default: null
  }
});

StakeSchema.statics.createStake = function (data, callback) {
  const Stake = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (data.language == 'all') {
    async.timesSeries(
      language_values.length,
      (time, next) => {
        data.language = language_values[time];
        
        Stake.createStake(data, (err, id) => {
          if (err) return next(err);

          return next(null, id);
        });
      },
      (err, id_list) => {
        if (err) return callback(err);

        return callback(null, id_list);
      }
    );
  } else {
    if (!data.language || !language_values.includes(data.language))
      return callback('bad_request');

    if (!data.name || typeof data.name != 'string' || !data.name.length || data.name.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    Image.findImageByUrl(data.image, (err, image) => {
      if (err) return callback(err);

      Stake.findStakeCountByLanguage(data.language, (err, order) => {
        if (err) return callback(err);

        fetchAPRandMarketPrice({
          apr_url: data.apr_api_url,
          market_price_url: data.market_price_url
        }, (err, stake_data) => {

          if (err || !data.stake_url || !validator.isURL(data.stake_url) || !data.how_to_stake_url || !validator.isURL(data.how_to_stake_url.toString())) {
            const newStakeData = {
              order,
              is_stakable: false,
              is_active: data.is_active ? true : false,
              language: data.language,
              name: data.name.trim(),
              image: image.url
            };
          
            const newStake = new Stake(newStakeData);
          
            newStake.save((err, stake) => {
              if (err) return callback('database_error');
        
              Image.findImageByUrlAndSetAsUsed(stake.image, err => {
                if (err) return callback(err);
        
                return callback(null, stake._id.toString());
              });  
            });
          } else {
            const newStakeData = {
              order,
              is_stakable: true,
              is_active: data.is_active ? true : false,
              language: data.language,
              name: data.name.trim(),
              image: image.url,
              stake_url: data.stake_url.toString(),
              how_to_stake_url: data.how_to_stake_url.toString(),
              apr_api_url: data.apr_api_url,
              market_price_url: data.market_price_url,
              apr: stake_data.apr,
              market_price: stake_data.market_price,
              last_update_time_in_ms: parseInt((new Date()).getTime())
            };
          
            const newStake = new Stake(newStakeData);
          
            newStake.save((err, stake) => {
              if (err) return callback('database_error');
        
              Image.findImageByUrlAndSetAsUsed(stake.image, err => {
                if (err) return callback(err);
        
                return callback(null, stake._id.toString());
              });  
            });
          }
        });
      });
    });
  }
};

StakeSchema.statics.findStakeById = function (id, callback) {
  const Stake = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Stake.findById(mongoose.Types.ObjectId(id.toString()), (err, stake) => {
    if (err) return callback('database_error');
    if (!stake) return callback('document_not_found');

    return callback(null, stake);
  });
};

StakeSchema.statics.findStakeByIdAndFormat = function (id, callback) {
  const Stake = this;

  Stake.findStakeById(id, (err, stake) => {
    if (err) return callback(err);

    getStake(stake, (err, stake) => {
      if (err) return callback(err);

      return callback(null, stake);
    });
  });
};

StakeSchema.statics.findStakeCountByLanguage = function (language, callback) {
  const Stake = this;

  if (!language || !language_values.includes(language))
    return callback('bad_request');

  Stake
    .find({
      language,
      is_deleted: { $ne: true } 
    })
    .countDocuments()
    .then(number => callback(null, number))
    .catch(err => callback('database_error'));
};

StakeSchema.statics.findStakesByFilters = function (data, callback) {
  const Stake = this;

  const filters = { is_deleted: { $ne: true } };

  if ('is_stakable' in data)
    filters.is_stakable = data.is_stakable ? true : false;

  if ('is_active' in data)
    filters.is_active = data.is_active ? true : false;

  if (data.language && language_values.includes(data.language))
    filters.language = data.language;

  Stake
    .find(filters)
    .sort({
      order: 1,
      language: 1
    })
    .then(stakes => async.timesSeries(
      stakes.length,
      (time, next) => getStake(stakes[time], (err, stake) => next(err, stake)),
      (err, stakes) => {
        if (err) return callback('database_error');

        return callback(null, stakes);
      }
    ))
    .catch(err => callback('database_error'));
};

StakeSchema.statics.findStakeByIdAndUpdate = function (id, data, callback) {
  const Stake = this;

  Stake.findStakeById(id, (err, stake) => {
    if (err) return callback(err);

    fetchAPRandMarketPrice({
      apr_url: data.apr_api_url,
      market_price_url: data.market_price_url
    }, (err, stake_data) => {
      if (err) return callback(err);

      Stake.findByIdAndUpdate(stake._id, {$set: {
        name: data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.name.trim() : stake.name,
        stake_url: data.stake_url && validator.isURL(data.stake_url.toString()) ? data.stake_url.toString() : stake.stake_url,
        how_to_stake_url: data.how_to_stake_url && validator.isURL(data.how_to_stake_url.toString()) ? data.how_to_stake_url.toString() : stake.how_to_stake_url,
        apr_api_url: data.apr_api_url,
        market_price_url: data.market_price_url,
        apr: stake_data.apr,
        market_price: stake_data.market_price,
        last_update_time_in_ms: parseInt((new Date()).getTime())
      }}, err => {
        if (err) return callback('database_error');
  
        return callback(null);
      });
    });
  });
};

StakeSchema.statics.checkIfImageIsUsed = function (url, callback) {
  const Stake = this;

  if (!url || typeof url != 'string')
    return callback('bad_request');

  Stake.findOne({
    image: url.trim()
  }, (err, stake) => {
    if (err)
      return callback('database_error');
    if (!stake)
      return callback(null, false);
    return callback(null, true);
  });
};

StakeSchema.statics.findStakeByIdAndUpdateImage = function (id, data, callback) {
  const Stake = this;

  Stake.findStakeById(id, (err, stake) => {
    if (err) return callback(err);

    Image.findImageByUrl(data.image, (err, image) => {
      if (err) return callback(err);

      Stake.findByIdAndUpdate(stake._id, {$set: {
        image: image.url
      }}, err => {
        if (err) return callback('database_error');

        Image.findImageByUrlAndSetAsUsed(image.url, err => {
          if (err) return callback(err);

          Stake.checkIfImageIsUsed(stake.image, (err, res) => {
            if (err) return callback(err);
            if (res) return callback(null); // Another stake is using the image

            Image.findImageByUrlAndDelete(stake.image, err => {
              if (err) return callback(err);
      
              return callback(null); 
            });
          });
        });
      });
    });
  });
};

StakeSchema.statics.findStakeByIdAndIncreaseOrder = function (id, callback) {
  const Stake = this;

  Stake.findStakeById(id, (err, stake) => {
    if (err) return callback(err);
    if (!stake.order)
      return callback('bad_request');

    Stake.findOne({
      language: stake.language,
      order: stake.order - 1
    }, (err, previous_stake) => {
      if (err) return callback('bad_request');

      Stake.findByIdAndUpdate(previous_stake._id, {$inc: {
        order: 1
      }}, err => {
        if (err) return callback('database_error');

        Stake.findByIdAndUpdate(stake.id, {$inc: {
          order: -1
        }}, err => {
          if (err) return callback('database_error');

          return callback(null);
        });
      });
    });
  });
};

StakeSchema.statics.findStakeByIdAndUpdateAPRandMarketPrice = function (id, callback) {
  const Stake = this;

  Stake.findStakeById(id, (err, stake) => {
    if (err) return callback(err);

    if (stake.last_update_time_in_ms && stake.last_update_time_in_ms + DEFAULT_UPDATE_TIME_IN_MS >= (new Date()).getTime())
      return callback(null, {
        apr: stake.apr,
        market_price: stake.market_price
      });

    fetchAPRandMarketPrice({
      apr_url: stake.apr_api_url,
      market_price_url: stake.market_price_api_url
    }, (err, data) => {
      if (err) return callback(err);

      Stake.findByIdAndUpdate(stake._id, {$set: {
        apr: data.apr,
        market_price: data.market_price,
        last_update_time_in_ms: parseInt((new Date()).getTime())
      }}, { new: true }, (err, stake) => {
        if (err) return callback('database_error');

        return callback(null, {
          apr: stake.apr,
          market_price: stake.market_price
        });
      });
    });
  });
};

StakeSchema.statics.findDeletedStakes = function (callback) {
  const Stake = this;

  Stake.find({
    is_deleted: true
  }, (err, stakes) => {
    if (err) return callback('database_error');

    return callback(null, stakes);
  });
};

StakeSchema.statics.findStakeByIdAndDelete = function (id, callback) {
  const Stake = this;

  Stake.findStakeById(id, (err, stake) => {
    if (err) return callback(err);
    if (stake.is_deleted)
      return callback(null);

    Stake.findByIdAndUpdate(stake._id, {$set: {
      is_deleted: true,
      order: -1 // Order is destroyed to prevent errors in order update
    }}, err => {
      if (err) return callback('database_error');

      Stake.find({
        language: stake.language,
        order: { $gt: stake.order },
        is_deleted: { $ne: true }
      }, (err, stakes) => {
        if (err) return callback('database_error');

        async.timesSeries(
          stakes.length,
          (time, next) => Stake.findByIdAndUpdate(stakes[time]._id, {$inc: {
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

StakeSchema.statics.findStakeByIdAndRestore = function (id, callback) {
  const Stake = this;

  Stake.findStakeById(id, (err, stake) => {
    if (err) return callback(err);
    if (!stake.is_deleted)
      return callback('bad_request');

      Stake.findStakeCountByLanguage(stake.language, (err, order) => {
        if (err) return callback(err);

        Stake.findByIdAndUpdate(stake._id, {
          is_deleted: false,
          is_active: false, // Restore stake inactive by default
          order
        }, err => {
          if (err) return callback('database_error');

          return callback(null);
        });
      });
  })
};

module.exports = mongoose.model('Stake', StakeSchema);
