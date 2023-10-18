const express = require('express');
const app = express();
app.use(express.json());
var cors = require('cors');
// const corsOptions = {
//   origin: 'http://localhost:3000', // replace with your client-side application's origin
//   credentials: true,
// };
app.use(cors());
// app.use(cors());
const mongoose = require('mongoose');
const config = require('config')
const path = require("path")
process.env['NODE_CONFIG_DIR'] = path.join(path.resolve("./"),"config/")
// Routes
const builder = require('./routes/requestQuote');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const retailers = require('./routes/retailer');
const newsletter = require('./routes/newsletter');
const paymentSubscription = require('./routes/paymentSubscription');
const plan = require('./routes/plan');
const company = require('./routes/company');
const category = require('./routes/category');
const subcategory = require('./routes/subcategory');
const product = require('./routes/product');
const home = require('./routes/home');
const tickets = require('./routes/supportTicket');
const encryption = require('./routes/encryption');
const csvupload = require('./routes/csvupload');
// const services = require('./routes/frontendServices');

const fileSystem = require('./routes/fileSystem');
app.use('/api/csv', csvupload);
app.use('/api/mails', builder);
app.use('/api/admin', admin);
app.use('/api/auth', auth);
app.use('/api/retailers', retailers);
app.use('/api/newsletter', newsletter);
app.use('/api/paymentSubscription', paymentSubscription);
app.use('/api/plan', plan);
app.use('/api/company', company);
app.use('/api/category', category);
app.use('/api/subcategory', subcategory);
app.use('/api/product', product);
app.use('/api/filesystem',fileSystem)
app.use('/api/tickets', tickets);
app.use('/api/crypt', encryption);
app.use('/', home);
// app.use('/api/services', services);



// Authentication Validation
if(!config.get('jwtPrivateKey')){
  console.error("FATA ERROR: jwtPrivateKey is not defined")
  process.exit(1);
}

// MongoDB Connection Code
const uri = "mongodb+srv://abdullah:1234@cluster0.nspdg.mongodb.net/kitbuilder?retryWrites=true&w=majority"

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => {
    console.error('Could not connect to MongoDB...',err)
    process.exit(1);
  });

// PORT Setup
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on Port ${port}...`))