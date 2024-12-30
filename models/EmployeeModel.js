const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const employeeSchema = new mongoose.Schema({
    email : {
        type : String,
        unique: true,
        required: true
    },
    phone : {type:String,
        required: true},
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

employeeSchema.pre("save",async function(next){
    const employee = this;
    if(!employee.isModified("password")){
        next();
    }
    try{
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(employee.password, saltRound);
        employee.password = hash_password;
    }catch(error){
        next(error);
    }
});

// compare the password 
employeeSchema.methods.comparePassword = async function(password){
       return bcrypt.compare(password, this.password);
};

employeeSchema.methods.generateToken = async function(){
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

const Employee = new mongoose.model("Employee", employeeSchema)
module.exports = Employee;