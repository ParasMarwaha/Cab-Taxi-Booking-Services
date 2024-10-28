const express = require('express');
const app = express();
const indexController = require('./controllers/index.controller');
const cookieParser = require('cookie-parser');
const {verify} = require('jsonwebtoken')
const fileupload = require('express-fileupload');

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(fileupload({}))
app.set('view engine', 'ejs');

// routes
const indexRouter = require("./routes/index")
const userRouter = require("./routes/user")
const adminRouter = require("./routes/admin")


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);




const PORT = process.env.PORT||8080
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));