const express = require('express');
const router = express.Router();

const errorGetController = require('../controllers/index/error/get');
const indexGetController = require('../controllers/index/index/get');

router.get(
  '/',
    indexGetController
);
router.get(
  '/error',
    errorGetController
);

module.exports = router;
