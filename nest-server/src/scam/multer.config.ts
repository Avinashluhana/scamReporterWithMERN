import { Request } from 'express';
import * as multer from 'multer';
import * as path from 'path';
import { mkdirSync, existsSync } from 'fs';

const uploadPath = 'uploads/scam/';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const appRoot = process.cwd(); // app root directory.
    const uploadDir = path.join(appRoot, uploadPath);

    // Create folder if doesn't exist
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // destination
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const originalFileName = path.basename(file.originalname, ext);
    
    const uniqueSuffix = Date.now();
    const fname = originalFileName + '-' + uniqueSuffix + ext;
    file['__uploadPath'] = '/media/scam/' + fname;

    cb(null, fname);
  },
});

function fileFilter(req: Request, file: Express.Multer.File, cb: any) {
  const allowedMimeTypes = ['image/jpeg', 'image/jpeg', 'application/pdf', 'application/msword'];
  const allowedFilesExtension = ['.png', '.jpg', '.jpeg', '.pdf', '.doc' ];

  if (allowedMimeTypes.includes(file.mimetype)) return cb(null, true);
  if (allowedFilesExtension.includes( path.extname(file.originalname.toLowerCase()))) return cb(null, true);

  return cb(new Error(`Only ${allowedFilesExtension.join(', ')} files are allowed`), false);
}

export const MulterConfigOptions: multer.Options = {
  limits: {
    fileSize: 1024 * 1024 * 5, // each file should less then 5 MB
  },
  fileFilter: fileFilter,
  storage: storage,
}