const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/login/get');

const blogsIndexGetController = require('../controllers/admin/blogs/index/get');
const blogsCreateGetController = require('../controllers/admin/blogs/create/get');
const blogsDeleteGetController = require('../controllers/admin/blogs/delete/get');
const blogsEditGetController = require('../controllers/admin/blogs/edit/get');
const blogsRestoreGetController = require('../controllers/admin/blogs/restore/get');

const projectsIndexGetController = require('../controllers/admin/projects/index/get');
const projectsCreateGetController = require('../controllers/admin/projects/create/get');
const projectsDeleteGetController = require('../controllers/admin/projects/delete/get');
const projectsEditGetController = require('../controllers/admin/projects/edit/get');
const projectsRestoreGetController = require('../controllers/admin/projects/restore/get');

const writersIndexGetController = require('../controllers/admin/writers/index/get');
const writersCreateGetController = require('../controllers/admin/writers/create/get');
const writersEditGetController = require('../controllers/admin/writers/edit/get');

const loginPostController = require('../controllers/admin/login/post');

const blogsCreatePostController = require('../controllers/admin/blogs/create/post');
const blogsDeletePostController = require('../controllers/admin/blogs/delete/post');
const blogsEditPostController = require('../controllers/admin/blogs/edit/post');
const blogsImagePostController = require('../controllers/admin/blogs/image/post');
const blogsOrderPostController = require('../controllers/admin/blogs/order/post');

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
  '/blogs',
    isAdmin,
    blogsIndexGetController
);
router.get(
  '/blogs/create',
    isAdmin,
    blogsCreateGetController
);
router.get(
  '/blogs/delete',
    isAdmin,
    blogsDeleteGetController
);
router.get(
  '/blogs/edit',
    isAdmin,
    blogsEditGetController
);
router.get(
  '/blogs/restore',
    isAdmin,
    blogsRestoreGetController
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
  '/blogs/create',
    isAdmin,
    blogsCreatePostController
);
router.post(
  '/blogs/delete',
    isAdmin,
    blogsDeletePostController
);
router.post(
  '/blogs/edit',
    isAdmin,
    blogsEditPostController
);
router.post(
  '/blogs/image',
    isAdmin,
    blogsImagePostController
);
router.post(
  '/blogs/order',
    isAdmin,
    blogsOrderPostController
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
