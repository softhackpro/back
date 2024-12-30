const mongoose = require('mongoose')
const GallerySchema = new mongoose.Schema({
    Title : {
        type : String,
        unique: true,
        required: true
    },
     user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    image : {
        type: String,
        default:"Name"
    },
    About : {
        type: String,
    },
    Type : {
        type: String,
    }
},
{
    timestamps: true
})

const Gallery = new mongoose.model("Gallery", GallerySchema)
module.exports = Gallery;