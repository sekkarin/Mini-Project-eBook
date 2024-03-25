import * as multer from 'multer';
import * as fs from 'fs';
export const storageEbookFiles = () =>
  multer.diskStorage({
    destination(req, file, callback) {
      const path = `./uploads/ebook`;
      fs.mkdirSync(path, { recursive: true });
      callback(null, path);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1000000000);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
  });
