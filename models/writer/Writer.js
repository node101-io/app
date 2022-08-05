const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Image = require('../image/Image');

const getLinks = require('./functions/getLinks');
const getWriter = require('./functions/getWriter');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const WriterSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    unique: true
  },
  image: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true
  },
  position: {
    type: String,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  links: {
    type: Object,
    default: {
      github: null,
      telegram: null,
      medium: null,
      twitter: null,
      instagram: null,
      discord: null
    }
  }
});

WriterSchema.statics.createWriter = function (data, callback) {
  const Writer = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.name || typeof data.name != 'string' || !data.name.length || data.name.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.position || typeof data.position != 'string' || !data.position.length || data.position.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  Image.findImageByUrl(data.image, (err, image) => {
    if (err) return callback(err);

    const newWriterData = {
      name: data.name.trim(),
      image: image.url,
      position: data.position.trim(),
      links: getLinks(data.links)
    };
  
    const newWriter = new Writer(newWriterData);
  
    newWriter.save((err, writer) => {
      if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE) return callback('duplicated_unique_field');
      if (err) return callback('database_error');

      Image.findImageByUrlAndSetAsUsed(writer.image, err => {
        if (err) return callback(err);

        return callback(null, writer._id.toString());
      });
    });
  });
};

WriterSchema.statics.findWriterById = function (id, callback) {
  const Writer = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Writer.findById(mongoose.Types.ObjectId(id.toString()), (err, writer) => {
    if (err) return callback('database_error');
    if (!writer) return callback('document_not_found');

    return callback(null, writer);
  });
};

WriterSchema.statics.findWriterByIdAndFormat = function (id, callback) {
  const Writer = this;

  Writer.findWriterById(id, (err, writer) => {
    if (err) return callback(err);

    getWriter(writer, (err, writer) => {
      if (err) return callback(err);

      return callback(null, writer);
    });
  });
};

WriterSchema.statics.findWriterByIdAndUpdate = function (id, data, callback) {
  const Writer = this;

  Writer.findWriterById(id, (err, writer) => {
    if (err) return callback(err);

    Writer.findByIdAndUpdate(writer._id, {$set: {
      name: data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.name.trim() : writer.name,
      description: data.position && typeof data.position == 'string' && data.position.trim().length && data.position.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.position.trim() : writer.position,
      links: getLinks(data.links)
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

WriterSchema.statics.checkIfImageIsUsed = function (url, callback) {
  const Writer = this;

  if (!url || typeof url != 'string')
    return callback('bad_request');

  Writer.findOne({
    image: url.trim()
  }, (err, writer) => {
    if (err)
      return callback('database_error');
    if (!writer)
      return callback(null, false);
    return callback(null, true);
  });
};

WriterSchema.statics.findWriterByIdAndUpdateImage = function (id, data, callback) {
  const Writer = this;

  Writer.findWriterById(id, (err, writer) => {
    if (err) return callback(err);

    Image.findImageByUrl(data.image, (err, image) => {
      if (err) return callback(err);

      Writer.findByIdAndUpdate(writer._id, {$set: {
        image: image.url
      }}, err => {
        if (err) return callback('database_error');

        Image.findImageByUrlAndSetAsUsed(image.url, err => {
          if (err) return callback(err);

          Writer.checkIfImageIsUsed(writer.image, (err, res) => {
            if (err) return callback(err);
            if (res) return callback(null); // Another writer is using the image

            Image.findImageByUrlAndDelete(writer.image, err => {
              if (err) return callback(err);
      
              return callback(null); 
            });
          });
        });
      });
    });
  });
};

module.exports = mongoose.model('Writer', WriterSchema);
