const mongoose = require('mongoose')
const SavedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    Title:{
        type:String,
        required: true,
    },
    YouTube : {
        type : String,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
            },
            message: props => `${props.value} is not a valid YouTube URL!`,
        },
    },
    oprice : {
        type: Number,
        required: true,
        min: 5,
    },
    dprice : {
        type: Number,
        required: true,
        min: 4,
    },
    brand : {
        type: String,
        default:"Generic"
    },
    pincode : {
        type: String,
        required: true,
    },
    deladdress : {
        type: String,
        required: true,
    },
    taxrate : {
        type : Number,
        required: true,
    },
    scost : {
        type: Number,
        default:50
    },
    state : {
        type: String,
        default:"Jharkhand"
    },
    stock : {
        type: Number,
        default:1
    },
    sku : {
        type: String,
        default:"Cannot Generated"
    },
    code : {
        type: String,
    },
    percent : {
        type: Number,
        default:0,
        min: 0,
        max: 100,
    },
    category : {
        type: String,
        required: true,
        index: true,
    },
    About : {
        type: String,
        required: true,
    },
    Type : {
        type: String,
        required: true,
    },
    image : {
        type: String,
        required: true,
    },
    phot : {
        type: String,
    },
    ProductImage:{
        type:Array,
    }
},
{
    timestamps: true
})

SavedSchema.pre('save', function (next) {
    if (this.oprice <= this.dprice) {
        return next(new Error('Original price must be greater than discounted price.'));
    }
    next();
});

const Saved = new mongoose.model("Saved", SavedSchema)
module.exports = Saved; 