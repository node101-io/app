const express = require('express');
const router = express.Router();

const indexGetController = require('../controllers/blog/index/get');

router.get(
  '/*',
    indexGetController
);

module.exports = router;
