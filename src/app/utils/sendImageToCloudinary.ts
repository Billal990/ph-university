import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from "fs"

// Configuration
cloudinary.config({
  cloud_name: 'dxhu87tg2',
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret, // Click 'View Credentials' below to copy your API secret
});

export const sendImageToCloudinary = async (
  path: string,
  imageName: string,
) => {
  const result = await cloudinary.uploader.upload(path, {
    public_id: imageName,
  });

  fs.unlink(path, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`);
    }
    console.log(`File ${path} has been successfully removed.`);
  });
  
return result;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
