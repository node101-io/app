const express = require('express');
const router = express.Router();

const aboutUsGetController = require('../controllers/index/about_us/get');
const errorGetController = require('../controllers/index/error/get');
const indexGetController = require('../controllers/index/index/get');
const stakeGetController = require('../controllers/index/stake/get');

router.get(
  '/',
    indexGetController
);
router.get(
  '/about_us',
    aboutUsGetController
);
router.get(
  '/error',
    errorGetController
);
router.get(
  '/stake',
    stakeGetController
);

module.exports = router;
