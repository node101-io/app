const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/login/get');

const projectsIndexGetController = require('../controllers/admin/projects/index/get');
const projectsCreateGetController = require('../controllers/admin/projects/create/get');
const projectsDeleteGetController = require('../controllers/admin/projects/delete/get');
const projectsEditGetController = require('../controllers/admin/projects/edit/get');
const projectsRestoreGetController = require('../controllers/admin/projects/restore/get');

const writersIndexGetController = require('../controllers/admin/writers/index/get');
const writersCreateGetController = require('../controllers/admin/writers/create/get');
const writersEditGetController = require('../controllers/admin/writers/edit/get');

const loginPostController = require('../controllers/admin/login/post');

const projectsCreatePostController = require('../controllers/admin/projects/create/post');
const projectsDeletePostController = require('../controllers/admin/projects/delete/post');
const projectsEditPostController = require('../controllers/admin/projects/edit/post');
const projectsImagePostController = require('../controllers/admin/projects/image/post');
const projectsOrderPostController = require('../controllers/admin/projects/order/post');
const projectsStatusPostController = require('../controllers/admin/projects/status/post');

const writersCreatePostController = require('../controllers/admin/writers/create/post');
const writersEditPostController = require('../controllers/admin/writers/edit/post');
const writersImagePostController = require('../controllers/admin/writers/image/post');

router.get(
  '/',
    isAdmin,
    indexGetController
);
router.get(
  '/login',
    loginGetController
);

router.get(
  '/projects',
    isAdmin,
    projectsIndexGetController
);
router.get(
  '/projects/create',
    isAdmin,
    projectsCreateGetController
);
router.get(
  '/projects/delete',
    isAdmin,
    projectsDeleteGetController
);
router.get(
  '/projects/edit',
    isAdmin,
    projectsEditGetController
);
router.get(
  '/projects/restore',
    isAdmin,
    projectsRestoreGetController
);

router.get(
  '/writers',
    isAdmin,
    writersIndexGetController
);
router.get(
  '/writers/create',
    isAdmin,
    writersCreateGetController
);
router.get(
  '/writers/edit',
    isAdmin,
    writersEditGetController
);

router.post(
  '/login',
    loginPostController
);

router.post(
  '/projects/create',
    isAdmin,
    projectsCreatePostController
);
router.post(
  '/projects/delete',
    isAdmin,
    projectsDeletePostController
);
router.post(
  '/projects/edit',
    isAdmin,
    projectsEditPostController
);
router.post(
  '/projects/image',
    isAdmin,
    projectsImagePostController
);
router.post(
  '/projects/order',
    isAdmin,
    projectsOrderPostController
);
router.post(
  '/projects/status',
    isAdmin,
    projectsStatusPostController
);

router.post(
  '/writers/create',
    isAdmin,
    writersCreatePostController
);
router.post(
  '/writers/edit',
    isAdmin,
    writersEditPostController
);
router.post(
  '/writers/image',
    isAdmin,
    writersImagePostController
);

module.exports = router;
