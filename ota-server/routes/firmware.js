const express = require('express');
const router = express.Router();
const multer = require('multer');
// const upload = multer({ dest: "uploads/" });
const { getFirmwares, getFirmwareById, uploadFirmware, downloadFirmware } = require('../controllers/firmwareController');
const { authenticatedRoute } = require('../middleware/authHandler');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
//   limits: {
//     fileSize: 1000000 // max file size 1MB = 1000000 bytes
//   },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(bin)$/)) {
      return cb(
        new Error(
          'Only .bin files are accepted.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

/* GET firmware listing. */
router.get('/', authenticatedRoute, getFirmwares);
router.get('/:firmwareId', authenticatedRoute, getFirmwareById);
router.post('/upload', upload.single('file'), authenticatedRoute , uploadFirmware);
router.get('/download/:firmwareId', authenticatedRoute, downloadFirmware);

module.exports = router;