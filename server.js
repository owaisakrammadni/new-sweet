var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
// var path = require("path")
var jwt = require('jsonwebtoken')
const multer = require('multer')
var app = express()
var authRoutes = require('./auth/auth')
var { foodModel } = require("./database/module")
var { itemOrderModel, addProductModel } = require("./database/module")
var SERVER_SECRET = '1255';

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('dev'));
// app.use("/", express.static(path.resolve(path.join(__dirname, "public")));

const storage = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })


const admin = require("firebase-admin");
// https://firebase.google.com/docs/storage/admin/start

var SERVER_ACCOUNT = {
    "type": "service_account",
    "project_id": "sweet-shop-d3796",
    "private_key_id": "fab6ddb31089f73c84a4b528e4894a8ae70c1136",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCbLvxwHcR+Aw9\nd2MPR64MUTSy2f6ReTuEeWUtpZc0b8Nox7/AgptloslzM+RYLgf8kDPthal2tXmF\n8VZ972GTqx6XsoKLC8pKHyg5PFVLO9IPTwSn+OOeLmA5xOeB/box+GUT3r46kFhj\n/wI9wLd7RAoexV8T2L47bGGBay6ydDZ9VkB81wnCzCSepurLRWKqLyS7L5tzntVB\ntZN36yqD//6FNS3kpTgNYJX+9qfdjlkLbJj7Xb/EBokPe4OcylGaKEV5QmkdkdpP\ne9Ef+vq961A22uneR8W7G73llA91llp+Y7Awb8C5pigEDfNRl9bFaAqma1kmEeRs\nDcaTxAoDAgMBAAECggEAXrDTdmIM+9DpsTQIqGP6RiB0wJjATbyUOqhfGTS5aD34\nl3sVjl5t7bmzUGrZDwNYO29GAywihWDML2qDe/FO/jsMusgjoTHcU25KSlnylqIr\nY+5Rr7ddsGgY0HnwYNSgzv6Rx/QnhOFRU15bCpVmJ2BTZ3osHL/moo1eDciUZS+v\n0a8zs/kUngDfEBFPFj4CVerHJ43JL+pX+jxmPq97GZsjF7zUGxHhAyER+iqN2X0s\nwkz20RfoZXNE5MMdKkLDAmPqFSxsfJkmpeGMsPL62aTIFi2BiToBg9TtNF8TL9Zk\nOf1jjrQOBpb2s8SrH6ij7zdAP0uvddz7ebjteeiN3QKBgQDq6FC53zHEdvB0eIIH\nqM0z9ltOhl5k2uzYEhHqMhNicrJSXpD60pRPFLxetxF/HTYQylWRElX/k3M6CbKK\nKhUGMulqt5G/8FCkb7TIZF5FvYfDXN4rpek7UQxWq7uP7nZ59gVcLnVhStwKf5M8\nXzBPbmCkuZpI7CQXJsB2f8u5JwKBgQDT4d15BRANzms0f6IOinEGCRRnlPh5r4uT\ndtVncMMsvDub3tfaMGMsxqAbzxloezdy2ddaDhY8V9R//bZiNj8s8MS1J/h0VHtF\nuOSSoMlUjg14GFAyqKzMTaweOcRrJgx0gaqeOl9soA4ZHc6Qp52mVw40Knx7Xutp\nvVUddmBZxQKBgQDZxU0xQ20LyYfZMe650w+JYJX9EixoK1zuYrIg/xNhbRtLqUeW\nf6nmNj77P5QE17vLjQgOWYVIThXAdEUEOUcMXB5wRIXl/o+EIdri+8k5th8qSend\nZQ33Y4egwcw7/sHvBtipQJio/ZFIWkTQ7x4GRTlq/HW/rMs4e0BpmsfueQKBgEgD\n9eXDPcCjjzaJxwgQL/gwL9pA/O9HJjaZ5lDBN+VFmTESXeVQGvVGEXdCPc2QS7li\np1p5fT9HTvetwUbCT1i0APfdvQm1CS0aeb4InkV5/sP555BAWnMaV0zyr3sHtKYI\nyHf9OR/PitsokWQDRIccAbzjT+oSygrnij14ValNAoGAH5FPUBGRy3c8b9csZz6u\nU1j5HubjguAtPmP5P1cuoWWB1wDMWe5YYp1F0dRCvVALU1YFx0z/nXD9749llLEM\nNSDDUDLFvUVnMuQkIuT52GNhZTwCZTlJ1ocZKeAM7rDkXPJbOOwjm2l3+VhG+OEN\nFP6FetUVcE3zrIGkfJSPyLk=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-qdjvv@sweet-shop-d3796.iam.gserviceaccount.com",
    "client_id": "109375531723273803429",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qdjvv%40sweet-shop-d3796.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(SERVER_ACCOUNT),
    DATABASE_URL:"https://sweet-shop-95e0d-default-rtdb.firebaseio.com/"

});
const bucket = admin.storage().bucket("gs://sweet-shop-d3796.appspot.com");


app.get('/', (req, res, next) => {
    res.send("running")

})

app.use('/', authRoutes);

app.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies);
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate;

            if (diff > 30000000000) {
                res.status(401).send("token expired")
            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    role: decodedData.role
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/profile", (req, res, next) => {

    console.log(req.body)

    foodModel.findById(req.body.jToken.id, 'name email phone  createdOn role',
        function (err, doc) {
            if (!err) {
                console.log("doc:", doc)
                res.send({
                    profile: doc
                })

            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })


});
app.post("/order", (req, res, next) => {
    console.log("ordedsta", req.body.orderData)
    console.log("total", req.body.Total)
    if (!req.body.orderData || !req.body.Total) {
        res.status(403).send(`
        please send order and total in json body.
            e.g:
            {
                "orders": "order",
                "total": "45785",
            }
        `)

        return;
    }

    foodModel.findOne({ email: req.body.jToken.email }, (error, user) => {
        console.log('user:', user)

        if (user) {
            itemOrderModel.create({
                name: req.body.name,
                phone: req.body.phone,
                status: "In review",
                email : req.body.jToken.email,
                address: req.body.address,
                total: req.body.Total,
                orders: req.body.orderData
            }).then((data) => {
                res.send({
                    status: 200,
                    message: "Order submitted",
                    data: data
                })
            }).catch(() => {
                res.send({
                    status: 500,
                    message: "submittion error, " + error
                })
            })
        } else {
            console.log("error", error)
        }
    })
})
app.get("/getorder", (req, res, next) => {
    itemOrderModel.find({}, (data, error) => {
        if (data) {
            res.send({
                data: data,
            })
        } else {
            res.send(error)
        }
    })
})
app.get("/getproducts", (req, res, next) => {
    addProductModel.find({}, (data, error) => {
        if (data) {
            res.send({
                data: data
            })
        } else {
            res.send(error)
        }
    })
})
app.get("/myOrders", (req, res, next) => {
    foodModel.findOne({ email: req.body.jToken.email }, (err, user) => {
        console.log("this is user.... ", user);    
        if (user) {
        itemOrderModel.find({ email: req.body.jToken.email }, (error, data) => {
            console.log("this is data.... ", data);    
            if (data) {
                
                    res.send({
                        data: data,
                        message:'maal aa rha hai'
                    })
                } else {
                    res.send(error)
                }
            })
        } else {
            res.send(err)
        }
    })
})
app.post('/updateStatus',(req,res,next)=>{
    itemOrderModel.findById({_id:req.body.id},(err,data)=>{
        if(data){
            data.updateOne({status:req.body.status},(error,update)=>{
                if(update){
                    res.send('status update')
                }else{
                    console.log(error)
                }
            })
        }else{
            res.send(err)
        }
    })
})



app.post("/upload", upload.any(), (req, res, next) => {

    console.log("req.body: ", req.body);
    
    console.log(" req.cookies.jToken: ", req.cookies.jToken);
    console.log(" req.headers.jToken ==============: ", req.headers.jToken);
    console.log(" req.body.jToken: ", req.body.jToken);


    bucket.upload(
        req.files[0].path,
        function (err, file, apiResponse) {
            if (!err) {
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0])
                        addProductModel.create({
                            product: req.body.product,
                            price: req.body.price,
                            image: urlData[0],
                        }).then((data) => {
                            console.log(data)
                            res.send({
                                status: 200,
                                message: "product added successfully",
                                data: data
                            }).catch((error) => {
                                console.log(error)
                                res.send({
                                    status: 500,
                                    message: "user create error:" + error
                                })
                            })
                        })
                        
                    } try {
                        fs.unlinkSync(req.files[0].path)
                    } catch (err) {
                        console.error(err)
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})