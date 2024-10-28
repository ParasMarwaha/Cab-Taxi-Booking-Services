const express = require('express');
const {verify} = require("jsonwebtoken");
const userController = require("../controllers/userController");
const adminController = require("../controllers/index.controller");
const router = express.Router();


function userAuthorization(req, res, next) {
    if (!req.cookies.userToken) {
        return res.redirect('/user/userLogin')
    }

    let token = req.cookies.userToken
    let secret = "abc@123"
    try {
        req.userInfo = verify(token, secret)
        next()
    } catch (error) {
        res.redirect('/user/userLogin')
    }
}

function userAuthorization_http(req, res, next) {
    if (!req.cookies.userToken) {
        return res.json({error:'Unauthorized Access'})
    }

    let token = req.cookies.userToken
    let secret = "abc@123"
    try {
        req.userInfo = verify(token, secret)
        next()
    } catch (error) {
        res.redirect('/user/userLogin')
    }
}

router.get("/userLogin", (req, res) => {
    res.render("user/userLogin");
})

router.get("/userSignup", (req, res) => {
    res.render("user/userSignup");
})

router.get("/userLogout", (req, res) => {
    res.clearCookie('userToken');
    res.redirect('/user/userLogin');
})

router.get("/userChangePassword", userAuthorization, (req, res) => {
    res.render("user/changePassword", {id: req.userInfo.id});
})

router.get("/userDashboard", userAuthorization, (req, res) => {
    res.render("user/dashboard");
})

router.get("/userForgotPassword", (req, res) => {
    res.render("user/userForgotPassword");
})

router.get("/userChangeForgotPassword", (req, res) => {
    res.render("user/userChangeForgotPassword");
})

router.get("/Book-Taxi", userAuthorization,(req, res) => {
    res.render("user/BookTaxi");
})

router.get("/My-Bookings", userAuthorization,(req, res) => {
    res.render("user/MyBooking");
})

router.post("/userSignup", userController.UserSignup)

router.post("/userLogin", userController.UserLogin)

router.post("/userChangePassword/:id",userAuthorization_http, userController.UserChangePassword)

router.post("/userForgotPassword", userController.UserForgotPassword)

router.post("/userVerifyOtp", userController.UserVerifyOtp)

router.post("/userChangeForgotPassword", userController.UserChangeForgotPassword)

router.post('/read-search-taxi',userAuthorization_http,userController.ReadSearchTaxi)

router.get('/read-searched-taxi/:car_id',userAuthorization_http,userController.ReadSearchTaxiBook)

router.get('/user-data',userAuthorization_http,userController.UserData)

router.post('/bookings',userAuthorization_http,userController.Bookings)

router.get('/user-Bookings',userAuthorization_http,userController.UserBookings)


module.exports = router;