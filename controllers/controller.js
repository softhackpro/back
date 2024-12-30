const User = require ("../models/userModel");
const Employee = require ("../models/EmployeeModel");
const Gallery = require ("../models/gallery");
const Settings = require ("../models/settings");
const Saved = require("../models/saved");
const nodemailer = require('nodemailer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const getHome = async (req, res)=>{
    try {
        const value = await Settings.findOne().select('-_id -updatedAt')
        const policy = await Gallery.find({Type:'add pages'}).sort({_id:-1}).limit(10)
        const category = await Gallery.find({Type:'category'}).sort({_id:-1}).limit(10).select('Photo _id Title')
        const banner = await Gallery.find({Type:'add banner'}).sort({_id:-1}).select(' -createdAt -updatedAt')
        const featured = await Saved.find().sort({_id:-1}).limit(6).select('_id Title image')
        const newproduct = await Saved.aggregate([
            { $sample: { size: 6 } },
            { $project: { _id: 1, Title: 1, image: 1, About:1 } }
        ]);
        const data = {value, category, banner, featured, newproduct, policy}
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
}
const head = async (req, res) => {
    try {
        const value = await Settings.findOne().select('rectangleLogo');

        if (!value) {
            return res.status(404).json({ message: "logo not found" });
        }

        res.status(200).send({ rectangleLogo: value.rectangleLogo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching settings" });
    }
};

const mailotp = async(req, res) => {
    
    const {userskaOTP} = req.body;
    const otp = Math.floor(100000 + Math.random()*900000).toString(); 
    console.log(userskaOTP);
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user:'allindiadusadhpariwar.org@gmail.com',
        pass: 'kfeo oatx prkq gttd'
    },
});

const sendOTPEmail = (userskaOTP, otp) =>{
    
    const mailOptions = {
        from:'AIDP',
        to: userskaOTP,
        subject : 'Your OTP For AIDP',
        text:`Your One Time Verification Code is ${otp}. Please don't share it with anyone. Thank You for joining with AIDP Family.`,
    };
    transporter.sendMail(mailOptions, (error, info)=> {
       if(error){
        console.log('error sending', error);
       }else{
        console.log('email sent');
       }
    });
};
sendOTPEmail(userskaOTP, otp);
res.json(otp);
}
const getcontact = async(req, res) => {
    const {formData} = req.body;
    
    const reciever = 'allindiadusadhpariwar.org@gmail.com'
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user:'allindiadusadhpariwar.org@gmail.com',
        pass: 'kfeo oatx prkq gttd'
    },
});

const sendOTPEmail = (reciever, formData) =>{
    
    const mailOptions = {
        from:'AIDP',
        to: reciever,
        subject : `Pandit Booking ${formData.name}`,
        text: `${formData.address} sent by ${formData.name} and phone no. ${formData.phone} and puja is ${formData.puja} and city id ${formData.city} `,
    };
    transporter.sendMail(mailOptions, (error, info)=> {
       if(error){
        console.log('error sending', error);
       }else{
        console.log('email sent');
       }
    });
};
sendOTPEmail(reciever, formData);
res.json({message: "Message sent"});
}
const addpost = async(req, res) =>{
    
        const {user, Title, YouTube, oprice, dprice, brand, pincode, deladdress, taxrate, scost, state, stock, sku, code, percent, category, About, Type} = req.body;
   const skuid = sku + Date.now();
   const image = req.files['image'][0].filename;
   const phot = req.files["phot"][0].filename;
   const ProductImage = req.files['ProductImage'].map(file => file.filename);
   try {
    if(Type === "add product"){
   const SavedData = new Saved({
   Title:Title,
   YouTube:YouTube,
   oprice:oprice,
   dprice:dprice,
   brand:brand,
   pincode:pincode,
   deladdress:deladdress,
   taxrate:taxrate,
   scost:scost,
   state:state,
   stock:stock,
   sku:skuid,
   code:code,
   percent:percent,
   category:category,
   About:About,
   Type:Type,
   image:image,
   phot:phot,
   ProductImage:ProductImage,
   user:user
})
    await SavedData.save();
        res.status(201).json(`${Type} added successfully`);
} else if (Type === "add pages"){
    const GalleryData = new Gallery({
    Title:Title,
    About:About,
    Type:Type,
    image:image,
    user:user
 })
     await GalleryData.save();
         res.status(201).json(`${Type} added successfully`);
 }
    } catch (error) {
        res.status(500).json("Fill all Fields Properly");
    }
   
}
const notice = async(req, res) =>{
    
    const {Title, Type, About} = req.body;
    try {
        if(Type === 'page'){
            const GalleryData = new Gallery({
                Title:Title,
                Type:Type,
                About:About
            })
            await GalleryData.save();
            res.status(201).json({message: "Page Updated successfully"});
        }else if(Type === 'notice'){
            const GalleryData = new Gallery({
                Title:Title,
                Type:Type
            })
            await GalleryData.save();
            res.status(201).json({message: "Notice Added successfully"});
        }else if(Type === 'faq'){
            const GalleryData = new Gallery({
                Title:Title,
                Type:Type,
                About:About
            })
            await GalleryData.save();
            res.status(201).json({message: "FAQ added successfully"});
        }
    } catch (error) {
        console.log(error);
        
    }
    
     
}
const getdata = async(req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 12;
    try {
        const data = await User.find().sort({_id:-1}).limit(12).skip(skip).select('-password');
        res.json(data)
    } catch (error) {
       console.log(error);
        
    }
     
}

const getSettings = async(req, res) =>{
    try {
        // Retrieve the first settings document (assuming only one settings document exists)
        const settings = await Settings.findOne();
    
        if (!settings) {
          return res.status(404).json({ message: 'Settings not found' });
        }
    
        res.status(200).json({
          message: 'Settings fetched successfully',
          data: settings,
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    
     
}
const getvalue = async(req, res) =>{
    const {value} = req.body;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 12;
    
    
    try {
        const data = await Gallery.find({Type:value}).sort({_id:-1}).skip(skip).limit(12);
        res.json(data)
    } catch (error) {
       console.log(error);
        
    }
     
}
const getProduct = async (req, res) => {
    console.log("got it");
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 12;
    try {
        const data = await Saved.find().sort({ _id: -1 }).skip(skip).limit(12);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
const getList = async (req, res) => {
    console.log(req.params);
    const {id} = req.params
    const Type = id
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 12;
    try {
        if(Type === "users"){
            const data = await User.find().sort({ _id: -1 }).skip(skip).limit(12);
            res.json(data);
        }  
        
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
const page = async(req, res) =>{
    const {id} = req.params;
    
    try {
        const data = await Gallery.findOne({_id:id, 
            $or: [{Type:'page'},
                {Type:'events'}
            ]});
        res.json(data)
    } catch (error) {
       console.log(error);
        
    }
     
}
const userDetail = async(req, res) =>{
    const {value} = req.body;
    
    try {
        const data = await Gallery.find({About:value, Type:'certificates'});
        res.json(data)
        
        
    } catch (error) {
       console.log(error);
        
    }
     
}
const deletepost = async (req, res)=>{
    try {
        const {id} = req.params;
        const deleteOneResult = await Gallery.findOne({_id:id})
        
        if(!deleteOneResult){
           console.log("not found");
           
        }
        if(deleteOneResult.Photo !== "Name"){
            fs.unlink(deleteOneResult.Photo, async(err)=>{
                if(err){
                   console.log("unexpected error");
                   
                }
            })
        }
        
        await Gallery.deleteOne({_id : id});
        res.json({message: "Deleted"});

          
    }
    catch (error) { 
        res.status(500).json({message: 'Server Error', error});
    }
}
const deleteuser = async (req, res)=>{
    try {
        const {id} = req.params;
        const deleteOneResult = await User.findOne({_id:id})
        
        if(!deleteOneResult){
            res.json({message: "Try later"})
        }
        await User.deleteOne({_id : id});
        res.json({message: "Deleted"});

          
    }
    catch (error) { 
        res.status(500).json({message: 'Server Error', error});
    }
}
const updateuser = async (req, res)=>{
    try {
        const {id} = req.params;
        const {load} = req.body;
        
        const updateOneResult = await User.findOne({_id:id})
        
        if(!updateOneResult){
            res.json({message: "Try later"})
        }
        await User.findByIdAndUpdate(id, {role : load}, { new: true });
        res.json({message: "Updated"});

          
    }
    catch (error) { 
        res.status(500).json({message: 'Server Error', error});
    }
}
const settings = async (req, res)=>{
    console.log(req.body);
    console.log(req.files);
    
    
    try {
        const existingSettings = await Settings.findOne(); // Assuming a single settings document
    
        // Prepare updated data
        const updatedData = {
          ...req.body, // Form data
          rectangleLogo: req.files?.rectangleLogo ? `${req.files.rectangleLogo[0].filename}` : existingSettings?.rectangleLogo,
          squareLogo: req.files?.squareLogo ? `${req.files.squareLogo[0].filename}` : existingSettings?.squareLogo,
        };
    
        // If settings exist, update; otherwise, create new
        let updatedSettings;
        if (existingSettings) {
          updatedSettings = await Settings.findByIdAndUpdate(existingSettings._id, updatedData, { new: true });
        } else {
          updatedSettings = await Settings.create(updatedData);
        }
    
        res.status(200).json({
          message: 'Settings updated successfully',
          data: updatedSettings,
        });
      } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
}
const addblog = async (req, res)=>{
    
    try {
       const {Title, About, Type, user } = req.body;
       const {filename} = req.file;
       
       if (Type === "add blogs" || Type === "add pages"){
        const GalleryData = new Gallery({
            Title:Title,
            About:About,
            Type:Type,
            image:filename,
            user:user
         })
             await GalleryData.save();
                 res.status(201).json(`${Type} added successfully`);
       } else if(Type === "add banner"){
        const GalleryData = new Gallery({
            Title:Title,
            Type:Type,
            image:filename,
            user:user
         })
             await GalleryData.save();
                 res.status(201).json(`${Type} added successfully`);
       }
          
    }
    catch (error) { 
        res.status(500).json({message: 'Server Error', error});
    }
}
const uploadvideo = async (req, res)=>{
    try {
        const videoPath = req.file.path;
        console.log(videoPath);
        
        const {filename} = req.file;
        const {userunique, username, BlogContent } = req.body;
        const outputFileName = `_${filename}.mp4`;
        const outputFilePath = path.join('public/Videos',outputFileName)
        // const BlogThumbnailo = req.files['BlogThumbnail'][0].filename;
        const BlogTitle = BlogContent.substring(0, 50);
        const Topic = "Flyn";
        // const {userunique, username, BlogTitle, BlogContent} = req.body;
        if (req.file.mimetype.startsWith('image/')){
            
            const Blogdata = new Blogup({
                userunique:userunique,
                username:username,
                BlogTitle: BlogTitle,
                BlogContent:BlogContent,
                BlogThumbnail:filename,
                BlogTopic:Topic
            })
            const blogupCreated =  await Blogdata.save();
            res.status(201).json({
                msg: blogupCreated,  
                userId: blogupCreated._id.toString()
            });
        }
       else if(req.file.mimetype.startsWith('video/')){

         ffmpeg(videoPath)
         .outputOptions(['-c:v libx264','-vf scale=-1:360', '-b:v 300k', '-c:a aac','-b:a 128k'])
         .on('end', ()=>{
            console.log('video processsing complete');
            // delete main file
            fs.unlink(videoPath, (err)=>{
                if(err){
                    console.error('error deleting original file');
                    return res.status(500).json({message: 'Error processing video'});
                }
                console.log('Original video deleted')
                const Blogdata = new Blogup({
                    userunique:userunique,
                    username:username,
                    BlogTitle: BlogTitle,
                    BlogContent:BlogContent,
                    BlogVideo:outputFileName,
                    BlogTopic:"Video"
                });
                const blogupCreated = Blogdata.save();
                res.status(201).json({
                msg: blogupCreated,  
            });

            })
         })
         .on('error', (err) => {
            console.error('Error processing', err);
            res.status(500).json({message: 'Error Processing video'})
          } )
          .save(outputFilePath);
        } 
    }
    catch (error) { 
        res.status(500).json("internal server error HI");
    }
}
module.exports = {uploadvideo, getList, head, getProduct, getSettings, settings, addblog, updateuser, deleteuser, deletepost, getHome, mailotp, getcontact, addpost, notice, getdata, getvalue, page, userDetail}