require('dotenv').config();
const express = require('express');
const {connectMongoDb} = require("./connection");
const path = require('path');
const userRouter = require('./routes/offers');
const signUpR = require('./routes/signup');
const signInR = require('./routes/signIn');
const addfoodR = require('./routes/addfood');
const multer = require('multer');
const fooditem = require('./models/fooditem');
const cookieParser = require("cookie-parser");
const {restrictToLoggedinUserOnly} = require('./middlewares/auth');
const cartR = require('./routes/cart');
const FiltercatR = require('./routes/Filtercat');
const PagesR = require('./routes/pages');
const OrdersR = require('./routes/Orders');
const DisplayOrdersR = require('./routes/DisplayOrders');
const LogOutR = require('./routes/LogOut');
const couponR = require('./routes/coupon');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const paypal = require('paypal-rest-sdk');

const paymentRoute = require('./routes/paymentRoute');

paypal.configure({
  'mode': 'sandbox', // 'sandbox' or 'live'
  'client_id': 'AQn56wRCsJLJ_x-kTW_0qv...',
  'client_secret': 'ELF_hyS_CWu5dkYDPbiYZRWEQRVWJxXYQaEp1mPYyehLx0PeBOUWmNdpzd2xmp2yCM3RDNuLdFLSYmRf'
});







// Set up session middleware
app.use(session({
  secret: "pratik@139eu2", // Replace with a strong secret
  resave: false,
  saveUninitialized: true,
}));

// Set up flash middleware
app.use(flash());

// Make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

//Instance of express is created.
//const app = express();

//upload instance is created
const upload = multer({dest: 'uploads/'});


//set view engine to EJS
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sanitize());
app.use(xss());


//Connection
connectMongoDb("mongodb://localhost:27017/Food").then(() => console.log("MongoDB connected!") );


//Middelware
app.use(express.json()); //This is used to accept the data in json format.
app.use(express.urlencoded({extended : true})); //This is used to parse the data.
app.use(cookieParser());




app.use('/user',userRouter);
app.use('/signUp',signUpR);
app.use('/signIn',signInR);
app.use('/addfood',addfoodR);
app.use('/cart',restrictToLoggedinUserOnly,cartR);
app.use('/filtercat',FiltercatR);
app.use('/pagination',PagesR);
app.use('/placeOrders/Orders',restrictToLoggedinUserOnly, OrdersR);
app.use('/displayOrders',DisplayOrdersR);
app.use('/logOut',LogOutR);
app.use('/apply-coupon',restrictToLoggedinUserOnly,couponR);
app.use('/pay',paymentRoute);



app.get('/', async (req, res) => {
  const allfood = await fooditem.find({});
  //console.log(allfood);
  

    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;
  
    try {
      
      const foodItems = await fooditem.find().skip(skip).limit(limit).exec();
      const count = await fooditem.countDocuments();
      const allfood = foodItems;
      const currentPage = page;
      const totalPages = Math.ceil(count / limit);
      res.render('index', { allfood,
        currentPage,
        totalPages,
        limit 
      });
     
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  




app.get('/', (req, res)=>{
  return res.render('index',{});
})


  //listen
  app.listen(8000, () => console.log(`Server started!`));




