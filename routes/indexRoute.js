const express = require('express');
const router = express.Router();

const aboutUsGetController = require('../controllers/index/about_us/get');
const errorGetController = require('../controllers/index/error/get');
const indexGetController = require('../controllers/index/index/get');
const stakeGetController = require('../controllers/index/stake/get');
const youtubeGetController = require('../controllers/index/youtube/get');

const umeeEndpointsGetController = require('../controllers/index/umee/endpoints');
const bandEndpointsGetController = require('../controllers/index/band/endpoints');

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
router.get(
  '/youtube',
    youtubeGetController
);

router.get(
  '/umee/endpoints',
    umeeEndpointsGetController
);
router.get(
  '/band/endpoints',
    bandEndpointsGetController
);

module.exports = router;
