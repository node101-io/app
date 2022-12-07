const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: './public/res/uploads/' });

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/login/get');

const bashUploadGetController = require('../controllers/admin/bash/get');

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

const stakeIndexGetController = require('../controllers/admin/stake/index/get');
const stakeCreateGetController = require('../controllers/admin/stake/create/get');
const stakeDeleteGetController = require('../controllers/admin/stake/delete/get');
const stakeEditGetController = require('../controllers/admin/stake/edit/get');
const stakeRestoreGetController = require('../controllers/admin/stake/restore/get');

const writersIndexGetController = require('../controllers/admin/writers/index/get');
const writersCreateGetController = require('../controllers/admin/writers/create/get');
const writersEditGetController = require('../controllers/admin/writers/edit/get');

const loginPostController = require('../controllers/admin/login/post');
const bashPostController = require('../controllers/admin/bash/post');

const blogsCreatePostController = require('../controllers/admin/blogs/create/post');
const blogsDeletePostController = require('../controllers/admin/blogs/delete/post');
const blogsEditPostController = require('../controllers/admin/blogs/edit/post');
const blogsImagePostController = require('../controllers/admin/blogs/image/post');
const blogsLogoPostController = require('../controllers/admin/blogs/logo/post');
const blogsOrderPostController = require('../controllers/admin/blogs/order/post');

const projectsCreatePostController = require('../controllers/admin/projects/create/post');
const projectsDeletePostController = require('../controllers/admin/projects/delete/post');
const projectsEditPostController = require('../controllers/admin/projects/edit/post');
const projectsImagePostController = require('../controllers/admin/projects/image/post');
const projectsOrderPostController = require('../controllers/admin/projects/order/post');
const projectsStatusPostController = require('../controllers/admin/projects/status/post');

const stakeCreatePostController = require('../controllers/admin/stake/create/post');
const stakeDeletePostController = require('../controllers/admin/stake/delete/post');
const stakeEditPostController = require('../controllers/admin/stake/edit/post');
//const stakeImagePostController = require('../controllers/admin/stake/image/post');


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
  '/bash',
    isAdmin,
    bashUploadGetController
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
  '/stake',
    isAdmin,
    stakeIndexGetController
);
router.get(
  '/stake/create',
    isAdmin,
    stakeCreateGetController
);
router.get(
  '/stake/delete',
    isAdmin,
    stakeDeleteGetController
);
router.get(
  '/stake/edit',
    isAdmin,
    stakeEditGetController
);
router.get(
  '/stake/restore',
    isAdmin,
    stakeRestoreGetController 
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
  '/bash',
    upload.single('file'),
    isAdmin,
    bashPostController
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
  '/blogs/logo',
    isAdmin,
    blogsLogoPostController
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
  '/stake/create',
    isAdmin,
    stakeCreatePostController
);
router.post(
  '/stake/delete',
    isAdmin,
    stakeDeletePostController
);
router.post(
  '/stake/edit',
    isAdmin,
    stakeEditPostController
);
// router.post(
//   '/stake/image',
//     isAdmin,
//     stakeImagePostController
// );
// router.post(
//   '/projects/order',
//     isAdmin,
//     stakeOrderPostController
// );

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
