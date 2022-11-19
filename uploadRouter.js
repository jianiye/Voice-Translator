let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    uuidv4 = require('uuid/v4'),
    router = express.Router();
const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "audio/wav" || file.mimetype == "audio/x-wav") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .wav format allowed!'));
        }
    }
});
// Audio model
let Audio = require('./Audio');
router.post('/audio', upload.single('profileAudio'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const audio = new Audio({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        profileAudio: url + '/public/' + req.file.filename
    });
    audio.save().then(result => {
        res.status(201).json({
            message: "Audio uploaded successfully!",
            audioCreated: {
                _id: result._id,
                profileAudio: result.profileAudio,
                encryptedFileName: req.file.filename
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})
router.get("/", (req, res, next) => {
    Audio.find().then(data => {
        res.status(200).json({
            message: "Audio list retrieved successfully!",
            audios: data
        });
    });
});
module.exports = router;