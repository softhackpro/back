const express = require("express");
const app = express();
app.use(express.static('public'));
const routere = express.Router();
const controllers = require("../controllers/controller");
const multer = require('multer')
const fs = require('fs');
const upload = multer({ dest: 'public/Images' })
const uploads = multer({ dest: 'public/Videos' })
const cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: "phot", maxCount: 1 }, { name: "ProductImage", maxCount: 8 }])
const cpUploads = upload.fields([{ name: 'rectangleLogo', maxCount: 1 }, { name: "squareLogo", maxCount: 1 }])

routere.post("/addpost", cpUpload, controllers.addpost);
routere.post("/settings", cpUploads, controllers.settings);
routere.post("/addblog", upload.single('image'), controllers.addblog);
routere.route("/getSettings").get(controllers.getSettings);
routere.route("/getProduct").get(controllers.getProduct);
routere.route("/getList/:id").get(controllers.getList);
routere.post("/uploadvideo", uploads.single('VideoName'), controllers.uploadvideo);
routere.route("/mailotp").post(controllers.mailotp);
routere.route("/getcontact").post(controllers.getcontact);
// routere.post("/addpost", upload.single('Photo'), controllers.addpost); 
routere.route("/notice").post(controllers.notice);
routere.route("/getdata").post(controllers.getdata);
routere.route("/getvalue").post(controllers.getvalue);
routere.route("/page/:id").post(controllers.page);
routere.route("/userDetail").post(controllers.userDetail);
routere.route("/getHome").get(controllers.getHome);
routere.route("/head").get(controllers.head);
routere.route("/updateuser/:id").post(controllers.updateuser);
routere.route("/deletepost/:id").delete(controllers.deletepost);
routere.route("/deleteuser/:id").delete(controllers.deleteuser);
routere.get('/video/:id', (req, res) => {
    const vidid = "1.mp4";
    console.log("reached", vidid)
    const path = `public/Videos/${vidid}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, { start, end }); //for local storage
        // const fileStream = s3.getObject({...params, Range: `bytes=${start}-${end}`}).createReadStream();  *for aws*
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res); //yaha filestream lagana hoga agar aws use kare aur local me file
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res); // ye local me
        // s3.getObject(params).createReadStream().pipe(res);  ye aws me lagana hai
    }
});
module.exports = routere;   