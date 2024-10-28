const express = require('express');
const {verify} = require("jsonwebtoken");
const adminController = require("../controllers/index.controller");
const router = express.Router();
const cookieParser = require('cookie-parser');
const app = require("express/lib/router");
const {urlencoded} = require("express");



function adminAuthorization_get(req, res, next) {
    if (!req.cookies.adminToken ) {
        res.redirect('/admin/login')
    }
    else {
        let token = req.cookies.adminToken
        let secret = "abc@123"

        try {
            req['adminInfo'] = verify(token, secret)
            // console.log(req['customerInfo'])
            next()
        } catch (error) {
            res.redirect('/admin/login')
        }
    }
}


router.get("/login", (req, res) => {
    res.render('admin/adminLogin');
})

router.get("/adminDashboard", adminAuthorization_get, (req, res) => {
    res.render('admin/dashboard');
})

router.get("/adminLogout", (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login')
})

router.get("/adminChangePassword", adminAuthorization_get, (req, res) => {
    res.render('admin/changePassword', {id: req.adminInfo.id});
})

router.get("/adminForgotPassword", (req, res) => {
    res.render('admin/adminForgotPassword');
})

router.get("/adminChangeForgotPassword", (req, res) => {
    res.render('admin/adminChangeForgotPassword');
})

router.get("/add-taxi", adminAuthorization_get,(req, res) => {
    res.render('admin/AddTaxi');
})

router.get("/view-taxi",adminAuthorization_get, (req, res) => {
    res.render('admin/ViewTaxi');
})

router.get("/All-Bookings",adminAuthorization_get, (req, res) => {
    res.render('admin/AllBookings');
})

router.get('/read-taxi',adminAuthorization_get,adminController.ReadTaxi)

router.get('/All-User-Bookings',adminAuthorization_get,adminController.AllUserBookings)

router.get('/user-desc/:user_id',adminAuthorization_get,adminController.UserDetails)

router.get('/update-car/:car_id',adminAuthorization_get,adminController.UpdateTaxi)

router.post('/update-taxi',adminAuthorization_get,adminController.UpdateCar)

router.get('/delete/:id',adminAuthorization_get,adminController.DeleteCar)

router.post("/adminLogin", adminController.AdminLogin)

router.post("/adminChangePassword/:id", adminController.AdminChangePassword)

router.post("/adminForgotPassword", adminController.AdminForgotPassword)

router.post("/adminVerifyOtp", adminController.AdminVerifyOtp)

router.post("/adminChangeForgotPassword", adminController.AdminChangeForgotPassword)

router.post("/add-taxi", adminController.AddTaxi)





module.exports = router;