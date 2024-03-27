const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const mongoDB = require('./config/mongo')
const cors = require('cors')

const User = require('./routes/user')

const PORT = process.env.PORT || 5010;

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(bodyParser.json())

app.get('/',(req,res) => {
  res.json({message:'deneme'})
});

app.use('/api', User)


mongoDB();
app.listen(PORT, () => {
  console.log(`${PORT} Port is active`);
});







