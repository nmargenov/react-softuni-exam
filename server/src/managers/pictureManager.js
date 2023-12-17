const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const multerGoogleStorage = require('multer-google-storage');
const { promisify } = require('util');
const fs = require('fs');
const tmp = require('tmp');

const keyFileContent = {
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
  };

const tmpobj = tmp.fileSync();
const keyFilePath = tmpobj.name;

fs.writeFileSync(keyFilePath, JSON.stringify(keyFileContent));

const bucket = process.env.BUCKET;
const projectId = process.env.PROJECT_ID;

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const createMulterUpload = (storageConfig) => {
    const storage = new Storage({
        projectId: storageConfig.projectId,
        credentials: {
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY,
        },
    });

    const bucket = storage.bucket(storageConfig.bucket);

    const storageEngine = multerGoogleStorage.storageEngine({
        bucket: bucket.name,
        projectId: storageConfig.projectId,
        credentials: {
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY,
          },      
          keyFilename:keyFilePath,
        acl: 'publicRead',
        filename: (req, file, cb) => {
            cb(null, storageConfig.directory + Date.now() + file.originalname);
        },
    });

    return multer({ storage: storageEngine, fileFilter });
};

const profileUpload = createMulterUpload({
    bucket: bucket,
    projectId: projectId,
    directory: 'profilePictures/',
}).single('profilePicture');

const postUpload = createMulterUpload({
    bucket: bucket,
    projectId: projectId,
    directory: 'postImages/',
}).single('postImage');

exports.editPublicProfileData = async (req, res) => {
    const uploadPromise = promisify(profileUpload);
    await uploadPromise(req, res);

    if (req.file) {
        return { image: req.file.path, bio: req.body.bio, username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName };
    } else {
        return { bio: req.body.bio, username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName };
    }
};

exports.postWithImage = async (req, res) => {
    const uploadPromise = promisify(postUpload);
    await uploadPromise(req, res);

    if (req.file) {
        return { image: req.file.path, description: req.body.description, owner: req.body.owner };
    } else {
        return { description: req.body.description, owner: req.body.owner };
    }
};

exports.deleteImage = async (objectPath) => {
    const storage = new Storage({
        projectId: projectId,
        keyFilename:keyFilePath,
    });

    const bucket = storage.bucket(process.env.BUCKET);
    const oldPictureFile = bucket.file(objectPath);

    if (oldPictureFile) {
        oldPictureFile.delete().then(() => {
        }).catch((error) => {
        });
    }
};

