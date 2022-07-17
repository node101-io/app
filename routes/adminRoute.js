const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const createGetController = require('../controllers/admin/create/get');
const editGetController = require('../controllers/admin/edit/get');
const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/login/get');

const createPostController = require('../controllers/admin/create/post');
const editPostController = require('../controllers/admin/edit/post');
const imagePostController = require('../controllers/admin/image/post');
const loginPostController = require('../controllers/admin/login/post');
const orderPostController = require('../controllers/admin/order/post');
const statusPostController = require('../controllers/admin/status/post');

router.get(
  '/',
    isAdmin,
    indexGetController
);
router.get(
  '/create',
    isAdmin,
    createGetController
);
router.get(
  '/edit',
    isAdmin,
    editGetController
);
router.get(
  '/login',
    loginGetController
);

router.post(
  '/create',
    isAdmin,
    createPostController
);
router.post(
  '/edit',
    isAdmin,
    editPostController
);
router.post(
  '/image',
    isAdmin,
    imagePostController
);
router.post(
  '/login',
    loginPostController
);
router.post(
  '/order',
    isAdmin,
    orderPostController
);
router.post(
  '/status',
    isAdmin,
    statusPostController
);

module.exports = router;
