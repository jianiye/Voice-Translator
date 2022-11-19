const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const audioSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    profileAudio: {
        type: String
    }
}, {
    collection: 'audios'
})
module.exports = mongoose.model('Audio', audioSchema)