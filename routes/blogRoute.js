const express = require('express');
const router = express.Router();

const indexGetController = require('../controllers/blog/index/get');
const detailsGetController = require('../controllers/blog/details/get');

const filterPostController = require('../controllers/blog/filter/post');

router.get(
  '/',
    indexGetController
);
router.get(
  '/*',
    detailsGetController
);

router.post(
  '/filter',
    filterPostController
);

module.exports = router;
