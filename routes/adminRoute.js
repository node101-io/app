const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const createGetController = require('../controllers/admin/create/get');
const deleteGetController = require('../controllers/admin/delete/get');
const editGetController = require('../controllers/admin/edit/get');
const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/login/get');
const restoreGetController = require('../controllers/admin/restore/get');

const createPostController = require('../controllers/admin/create/post');
const deletePostController = require('../controllers/admin/delete/post');
const editPostController = require('../controllers/admin/edit/post');
const imagePostController = require('../controllers/admin/image/post');
const loginPostController = require('../controllers/admin/login/post');
const orderPostController = require('../controllers/admin/order/post');
const statusPostController = require('../controllers/admin/status/post');

router.get(
  '/create',
    isAdmin,
    createGetController
);
router.get(
  '/delete',
    isAdmin,
    deleteGetController
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
router.get(
  '/restore',
    isAdmin,
    restoreGetController
);
router.get(
  '/*',
    isAdmin,
    indexGetController
);

router.post(
  '/create',
    isAdmin,
    createPostController
);
router.post(
  '/delete',
    isAdmin,
    deletePostController
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
