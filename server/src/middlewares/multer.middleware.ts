import multer from "multer";
import path from "path";
import { promises as fsPromises } from 'fs';

const uploadDir = "./public/uploads";

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await fsPromises.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });