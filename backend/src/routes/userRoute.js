// const express = require('express');
// const router = express.Router();

// const path = require('path');
// const multer = require('multer');
// const userController = require('@/controllers/userController');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, path.join(__dirname, '../../public/images'));
//     }
//   },
//   filenamefunction(req, file, cb) {
//     const name = Date.now() + '-' + file.originalname;
//     cb(null, name);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, true);
//   }
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// router.post('/register', upload.single('image'), userController.userRegister);

// module.exports = router;
