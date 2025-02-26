const jwt = require("jsonwebtoken");
const User = require('../models/EmployeeModel')
const authMiddleware = async (req, res, next)=>{
const token = req.header('Authorization');
if(!token){
    return res
    .status(401)
    .json({message:"Unauthorized HTTP, Token not providedoi"});
}
// console.log("token from auth middleware", token);

const jwtToken = token.replace("Bearer","").trim();
// console.log("token from auth middleware", jwtToken);
try {
    const isVerified = jwt.verify(jwtToken, process.env.TOKEN_SECRET_KEY);
    const userData = await User.findOne({email: isVerified.email}).select({
        password:0,
    });
    // console.log(userData);

    req.user = userData;
    req.token = token;
    req.userID = userData._id;
    next();
} catch (error) {
    return res
    .status(401)
    .json({message:"Unauthorized HTTP, Token not provided"});
}

};
module.exports = authMiddleware;