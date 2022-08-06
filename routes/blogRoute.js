const express = require('express');
const router = express.Router();

const indexGetController = require('../controllers/blog/index/get');

const filterPostController = require('../controllers/blog/filter/post');

router.get(
  '/*',
    indexGetController
);

router.post(
  '/filter',
    filterPostController
);

module.exports = router;
