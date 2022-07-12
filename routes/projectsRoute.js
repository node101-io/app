const express = require('express');
const router = express.Router();

const guideGetController = require('../controllers/projects/guide/get');
const indexGetController = require('../controllers/projects/index/get');

const filterPostController = require('../controllers/projects/filter/post');

router.get(
  '/',
    indexGetController
);
router.get(
  '/guide/*',
    guideGetController
);

router.post(
  '/filter',
    filterPostController
);

module.exports = router;
