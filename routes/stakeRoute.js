const express = require('express');
const router = express.Router();

const filterPostController = require('../controllers/admin/stake/filter/post');

router.post(
  '/filter',
    filterPostController
);

module.exports = router;
