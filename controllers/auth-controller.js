const Employee = require("../models/EmployeeModel");
const bcrypt = require("bcryptjs");
const home = async (req, res)=>{
    try {
        res.status(200).send("Welcome bro buddy ffg");
    } catch (error) {
        console.log(error);
    }
}

const register = async (req, res)=>{
    try {
        console.log(req.body);
        
        const {email, phone, password, fullname, role} = req.body;
        const userExist = await Employee.findOne({email:email});
        if(userExist){
            return res.status(400).json({msg:"Email already exist"});
        }
        // const saltRound = 10;
        // const hash_password = await bcrypt.hash(password, saltRound);
      const userCreated =  await Employee.create({email, phone, password, fullname, role});
        res.status(201).json({
            msg: userCreated, 
            token: await userCreated.generateToken(), 
            userId: userCreated._id.toString()
        });
        
    } catch (error) {
        res.status(500).json("internal server error");
    }
}



// Login Logic...

const login = async(req, res)=>{
    try {
        const { email, password} = req.body;
        const userExist = await Employee.findOne({email});
        if(!userExist){
            return res.status(400).json({message:"Invalid Login Details"});
        }
        // const user = await bcrypt.compare(password, userExist.password);
        const user = await userExist.comparePassword(password);
        if(user){
            res.status(200).json({
                msg: "Login successful",
                token: await userExist.generateToken(),
                userId: userExist._id.toString(),
            });

        }else{
            res.status(401).json({message:"Invalid email or password"});
        }
    } catch (error) {
        res.status(500).json("internal server error");
    }
}
// send user data logic 

const user = async (req, res) => {
    try {
       const userData = req.user; 
    res.status(200).json({userData});
    } catch (error) {
        console.log(`error from the user route ${error}`);
    }
}
module.exports = {home, register, login, user};