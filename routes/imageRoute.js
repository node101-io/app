const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: './public/res/uploads/' });

const isAdmin = require('../middleware/isAdmin');

const deleteGetController = require('../controllers/image/delete/get');

const uploadPostController = require('../controllers/image/upload/post');

router.get(
  '/delete',
    isAdmin,
    deleteGetController
);

router.post(
  '/upload',
    upload.single('file'),
    isAdmin,
    uploadPostController
)

module.exports = router;
