const async = require('async');
const mongoose = require('mongoose');

const links = [
  'http://POAP.xyz/claim/a87k4y',
  'http://POAP.xyz/claim/mtifns',
  'http://POAP.xyz/claim/2s0956',
  'http://POAP.xyz/claim/8dimqp',
  'http://POAP.xyz/claim/laauo3',
  'http://POAP.xyz/claim/3k75wv',
  'http://POAP.xyz/claim/w8u9sy',
  'http://POAP.xyz/claim/0sumrn',
  'http://POAP.xyz/claim/wisi3j',
  'http://POAP.xyz/claim/upqngs',
  'http://POAP.xyz/claim/5sf2wf',
  'http://POAP.xyz/claim/bbi9xz',
  'http://POAP.xyz/claim/xubn8h',
  'http://POAP.xyz/claim/xptkh8',
  'http://POAP.xyz/claim/fmtjeh',
  'http://POAP.xyz/claim/h4h6i3',
  'http://POAP.xyz/claim/8vgvao',
  'http://POAP.xyz/claim/d5mlsu',
  'http://POAP.xyz/claim/f83u42',
  'http://POAP.xyz/claim/zdekas',
  'http://POAP.xyz/claim/f4fnbg',
  'http://POAP.xyz/claim/48dxxr',
  'http://POAP.xyz/claim/ig80oz',
  'http://POAP.xyz/claim/rhtn78',
  'http://POAP.xyz/claim/omwt85',
  'http://POAP.xyz/claim/xl7dih',
  'http://POAP.xyz/claim/zfu9kc',
  'http://POAP.xyz/claim/p3lloy',
  'http://POAP.xyz/claim/ats32r',
  'http://POAP.xyz/claim/vxbjt9',
  'http://POAP.xyz/claim/l122dt',
  'http://POAP.xyz/claim/fhqnnu',
  'http://POAP.xyz/claim/2foswa',
  'http://POAP.xyz/claim/3zekvj',
  'http://POAP.xyz/claim/uqlv9s',
  'http://POAP.xyz/claim/0fhd5t',
  'http://POAP.xyz/claim/cw9v1c',
  'http://POAP.xyz/claim/ahtfgv',
  'http://POAP.xyz/claim/8ir3mb',
  'http://POAP.xyz/claim/korcb6',
  'http://POAP.xyz/claim/rp3o1e',
  'http://POAP.xyz/claim/95brup',
  'http://POAP.xyz/claim/7gwots',
  'http://POAP.xyz/claim/gg0eb3',
  'http://POAP.xyz/claim/9qns45',
  'http://POAP.xyz/claim/h13wlb',
  'http://POAP.xyz/claim/8laihk',
  'http://POAP.xyz/claim/pxka3y',
  'http://POAP.xyz/claim/m0xjgh',
  'http://POAP.xyz/claim/ivy5ol',
  'http://POAP.xyz/claim/uq51gz',
  'http://POAP.xyz/claim/qd9q56',
  'http://POAP.xyz/claim/izvqb2',
  'http://POAP.xyz/claim/g0uf3b',
  'http://POAP.xyz/claim/5jy1za',
  'http://POAP.xyz/claim/qacp25',
  'http://POAP.xyz/claim/y285fj',
  'http://POAP.xyz/claim/s129le',
  'http://POAP.xyz/claim/qys5kb',
  'http://POAP.xyz/claim/3jof2o',
  'http://POAP.xyz/claim/6rlmw1',
  'http://POAP.xyz/claim/uv75cd',
  'http://POAP.xyz/claim/d1x85i',
  'http://POAP.xyz/claim/2x5qu0',
  'http://POAP.xyz/claim/6t7bt9',
  'http://POAP.xyz/claim/sdldag',
  'http://POAP.xyz/claim/3tfobc',
  'http://POAP.xyz/claim/x5zb4c',
  'http://POAP.xyz/claim/s6s56n',
  'http://POAP.xyz/claim/rfdbi9',
  'http://POAP.xyz/claim/ipnogq',
  'http://POAP.xyz/claim/v3p06y',
  'http://POAP.xyz/claim/x2483m',
  'http://POAP.xyz/claim/mumynr',
  'http://POAP.xyz/claim/rirzeg',
  'http://POAP.xyz/claim/05iafg',
  'http://POAP.xyz/claim/d80wwr',
  'http://POAP.xyz/claim/5biipi',
  'http://POAP.xyz/claim/eqfbvj',
  'http://POAP.xyz/claim/nzb7jn',
  'http://POAP.xyz/claim/shqfx8',
  'http://POAP.xyz/claim/33jdql',
  'http://POAP.xyz/claim/8y1xss',
  'http://POAP.xyz/claim/dkqljz',
  'http://POAP.xyz/claim/dggmkw',
  'http://POAP.xyz/claim/gdbfb0',
  'http://POAP.xyz/claim/tinfh8',
  'http://POAP.xyz/claim/ers9sy',
  'http://POAP.xyz/claim/f7tvug',
  'http://POAP.xyz/claim/48v085',
  'http://POAP.xyz/claim/c1gubq',
  'http://POAP.xyz/claim/tmhed7',
  'http://POAP.xyz/claim/kel0fa',
  'http://POAP.xyz/claim/609tcp',
  'http://POAP.xyz/claim/kw1m2r',
  'http://POAP.xyz/claim/mox56t',
  'http://POAP.xyz/claim/ozgb5s',
  'http://POAP.xyz/claim/oclic5',
  'http://POAP.xyz/claim/fyoyj8',
  'http://POAP.xyz/claim/mvxn3o',
  'http://POAP.xyz/claim/az164z',
  'http://POAP.xyz/claim/50zut1',
  'http://POAP.xyz/claim/wjg5mf',
  'http://POAP.xyz/claim/qkjhz9',
  'http://POAP.xyz/claim/4k91nf',
  'http://POAP.xyz/claim/ijhrkc',
  'http://POAP.xyz/claim/zduh1i',
  'http://POAP.xyz/claim/mlfwxl',
  'http://POAP.xyz/claim/9ombew',
  'http://POAP.xyz/claim/80z9bj',
  'http://POAP.xyz/claim/l5pbaz',
  'http://POAP.xyz/claim/qgkaox',
  'http://POAP.xyz/claim/04kfpo',
  'http://POAP.xyz/claim/9n9dns',
  'http://POAP.xyz/claim/a0vdkq',
  'http://POAP.xyz/claim/ohl7q1',
  'http://POAP.xyz/claim/btbsku',
  'http://POAP.xyz/claim/o6i5j4',
  'http://POAP.xyz/claim/w3o7wy',
  'http://POAP.xyz/claim/00hf1j',
  'http://POAP.xyz/claim/jdnw0u',
  'http://POAP.xyz/claim/dh28jh',
  'http://POAP.xyz/claim/fcpzet',
  'http://POAP.xyz/claim/4to35q',
  'http://POAP.xyz/claim/aoobzg',
  'http://POAP.xyz/claim/y4hl7x',
  'http://POAP.xyz/claim/a9w0w5',
  'http://POAP.xyz/claim/h7b2fk',
  'http://POAP.xyz/claim/ynk1mf',
  'http://POAP.xyz/claim/vkym55',
  'http://POAP.xyz/claim/ffrxgp',
  'http://POAP.xyz/claim/4t60jm',
  'http://POAP.xyz/claim/cmghcd',
  'http://POAP.xyz/claim/x63ive',
  'http://POAP.xyz/claim/l1v86z',
  'http://POAP.xyz/claim/ccnylk',
  'http://POAP.xyz/claim/yzocut',
  'http://POAP.xyz/claim/yaiwnv',
  'http://POAP.xyz/claim/uya7s1',
  'http://POAP.xyz/claim/4gtvie',
  'http://POAP.xyz/claim/4p602j',
  'http://POAP.xyz/claim/e0f5t4',
  'http://POAP.xyz/claim/5l6o9q',
  'http://POAP.xyz/claim/ft86jr',
  'http://POAP.xyz/claim/jkpulb',
  'http://POAP.xyz/claim/76gu3p',
  'http://POAP.xyz/claim/hklrkm',
  'http://POAP.xyz/claim/vr9ozx',
  'http://POAP.xyz/claim/uj15u6',
  'http://POAP.xyz/claim/n1ximp'
];

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAX_ITEM_COUNT_PER_CRON_JOB = 1e2;

const Schema = mongoose.Schema;

const CryptistSchema = new Schema({
  link: {
    type: String,
    required: true,
    unique: true,
  },
  is_used: {
    type: Boolean,
    default: false
  }
});

CryptistSchema.statics.createAll = function(callback) {
  const Cryptist = this;

  async.timesSeries(
    links.length,
    (time, next) => {
      const newSchema = {
        link: links[time],
        is_used: false
      };

      const newCryptist = new Cryptist(newSchema);

      newCryptist.save((err, id) => {
        if (err) return next(err);

        return next(null, id);
      });
    },
    err => {
      if (err) return callback('database_error');

      return callback(null);
    }
  );
};

CryptistSchema.statics.findLastNotUsedLinkAndSetAsUsed = function(callback) {
  const Cryptist = this;

  Cryptist.findOne({
    is_used: false
  }, (err, cryptist) => {
    if (err) return callback('database_error');
    if (!cryptist)
      return callback('document_not_found');

    Cryptist.findByIdAndUpdate(cryptist._id, {$set: {
      is_used: true
    }}, err => {
      if (err) return callback('database_error');

      return callback(null, cryptist.link)
    });
  });
}

module.exports = mongoose.model('Cryptist', CryptistSchema);
