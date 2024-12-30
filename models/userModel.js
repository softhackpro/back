const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        unique: true,
        required: true
    },
    phone : Number,
    password: {
        type:String,
        required: true
    },
    fullname:{
        type:String,
        default: true
    },
    role: {
       type:String,
       default: "Member" 
    },
    profilepicture:{
        type:String,
        default:"public/Images/profilepic.png"
    }
    
},
{
    timestamps: true
})

userSchema.pre("save",async function(next){
    const user = this;
    if(!user.isModified("password")){
        next();
    }
    try{
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
    }catch(error){
        next(error);
    }
});

// compare the password 
userSchema.methods.comparePassword = async function(password){
       return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function(){
  try {
    return jwt.sign({
        phone: this.phone.toString(),
        email: this.email,
        fullname: this.fullname,
    },
    process.env.TOKEN_SECRET_KEY, 
    {
    expiresIn: "365d",
    }
);
  } catch (error) {
    console.error(error)
  }
};

const User = new mongoose.model("User", userSchema)
module.exports = User;