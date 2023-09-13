const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, "images");
//     },
//     filename: (req, file, callback) => {
//         const name = file.originalname.split(" ").join("_");
//         const extension = MIME_TYPES[file.mimetype];
//         const nameWithoutExtension = name.split(".")[0];
//         callback(null, nameWithoutExtension + Date.now() + "." + extension);
//     },
// });

// module.exports = multer({ storage }).any("file");

const googleCloud = new Storage({
    keyFilename: path.join(
        __dirname,
        `../${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
    ),
    projectId: process.env.GCS_ID,
});

const gcFiles = googleCloud.bucket(process.env.GCS_SPLIT_STRING);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (MIME_TYPES[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type."), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

const uploadMiddleware = upload.any("file");

const uploadToGCS = (file, req) => {
    const timestamp = Date.now();
    const fileName = `${path.parse(file.originalname).name}-${timestamp}.${
        MIME_TYPES[file.mimetype]
    }`;
    const blob = gcFiles.file(fileName);
    const stream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });
    stream.on("error", (err) => {
        console.error(`Error uploading file ${fileName}:`, err);
    });
    stream.on("finish", () => {
        console.log(`File ${fileName} uploaded.`);
        req.files.push({ filename: fileName });
    });
    stream.end(file.buffer);
};

module.exports = (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        req.files.forEach((file) => {
            uploadToGCS(file, req);
        });
        setTimeout(() => {
            next();
        }, 2000);
    });
};
