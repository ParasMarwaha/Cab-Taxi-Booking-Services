const connection = require('../db/connection');
const {sign} = require('jsonwebtoken')
const nodemailer = require("nodemailer");


function UserSignup(req, res) {
    //console.log(req.body)
    const {name, email, password,phone,address} = req.body;
    // const insertQuery = `insert into users(name,email,password,phone,address) Values('${name}', '${email}', '${password}')`
    const insertQuery = `insert into user (name, email, password,phone,address) Values(?,?,?,?,?)`
    connection.query(insertQuery, [name, email, password,phone,address], (error) => {
        {
            if (error) {
                res.json({error: error.message, message: ''});
            } else {
                // Send password to the email address using a mailer service (e.g., Nodemailer)
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // or 'STARTTLS'
                    auth: {
                        user: 'parasmarwaha246@gmail.com',
                        pass: 'auxq kiup dcan wlzi'
                    }
                });

                const mailOptions = {
                    from: 'parasmarwaha246@gmail.com',
                    to: email,
                    subject: 'User Signup',
                    text: `Thank You For Registering With US`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.json({error: 'Fail', message: ''});
                    }

                    // console.log('OTP sent to', email);
                    res.json({error: '', message: 'Sign up successful'});
                });
            }
        }
    })
}

function UserLogin(req, res) {
    const {email, password} = req.body;
    let checkQuery = `select * from user where email='${email}' and password='${password}'`
    connection.query(checkQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record.length === 0) {
                res.json({error: 'Invalid Email or Password', message: ''});
            } else {
                let payload = {
                    id: record[0].id,
                    email: record[0].email,
                    name: record[0].name,
                }
                let secret = "abc@123"
                let expiry = 60 * 60
                let token = sign(payload, secret, {expiresIn: expiry})
                res.cookie('userToken', token, {
                    expires: new Date(Date.now() + expiry * 1000)
                })
                res.json({error: '', message: 'Login successful'});
            }
        }
    })
}

function UserChangePassword(req, res) {
    const {id} = req.params
    const {oldPassword, newPassword} = req.body;
    let checkQuery = `select * from user where id=${id}`
    connection.query(checkQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].password !== oldPassword) {
                res.json({error: 'Old Password do not match', message: ''});
            } else {
                let changeQuery = `update user set password='${newPassword}' where id=${id}`
                connection.query(changeQuery, (error) => {
                    if (error) {
                        res.json({error: error.message, message: ''});
                    } else {
                        res.json({error: '', message: 'Password changed successfully'});
                    }
                })
            }
        }
    })
}

function UserForgotPassword(req, res) {
    {
        const {email} = req.body
        let l = 100000;
        let u = 999999;
        let OTP = Math.floor(l + (u - l) * Math.random());
        let insertQuery = `select * from user where email='${email}'`;
        connection.query(insertQuery, (error, record) => {
            if (error) {
                res.json({error: error.message, message: ''});
            } else {
                if (record.length === 0) {
                    res.json({error: 'Email does not Exist', message: ''});
                } else {
                    let updateQuery = `update user set otp='${OTP}' where email='${email}'`;
                    connection.query(updateQuery, (error) => {
                        if (error) {
                            res.json({error: error.message, message: ''});
                        } else {
                            const transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 587,
                                secure: false, // or 'STARTTLS'
                                auth: {
                                    user: 'parasmarwaha246@gmail.com',
                                    pass: 'auxq kiup dcan wlzi'
                                }
                            });

                            const mailOptions = {
                                from: 'parasmarwaha246@gmail.com',
                                to: email,
                                subject: 'OTP for Password Reset',
                                text: `Your OTP is: ${OTP}`
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    res.json({error: 'Failed to send OTP', message: ''});
                                }

                                // console.log('OTP sent to', email);
                                res.json({error: '', message: 'An OTP has been sent to given Email Address'});
                            });
                        }
                    })
                }
            }
        })
    }
}

function UserVerifyOtp(req, res) {
    const {email, otp} = req.body
    let selectQuery = `select * from user where email='${email}'`;
    connection.query(selectQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].otp !== otp) {

                res.json({error: 'OTP does not Matched', message: ''});
            } else {

                let nullQuery = `update user set otp=NULL`;
                connection.query(nullQuery, (error) => {
                    if (error) {
                        res.json({error: error.message, message: ''})
                    } else {
                        res.json({error: '', message: 'OTP Matched'})
                    }
                })
            }
        }
    })
}

function UserChangeForgotPassword(req, res) {
 // console.log(req.body)
    const {newPassword, email} = req.body
    let updateQuery = `update user set password='${newPassword}' where email='${email}'`;
    connection.query(updateQuery, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Password Changed Successfully'})
        }
    })
}

function ReadSearchTaxi(req, res) {
    //console.log(req.body)
    let {type,startDate,endDate} = req.body;
    let read = `SELECT c.* FROM cab c WHERE c.type = '${type}' AND c.car_id NOT IN (
    SELECT b.car_id FROM bookings b  WHERE b.startDate < '${endDate}' AND b.endDate > '${startDate}')`
    //console.log(read)
    connection.query(read, (error, record) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',record:record})
        }
    })
}

function UserData(req, res) {
    //console.log(req['userInfo'])
    let {id} = req['userInfo'];
    let read = `select * from user where id = '${id}' `
    connection.query(read, (error, record) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',record:record})
        }
    })
}

function ReadSearchTaxiBook(req, res) {
    //console.log(req.params)
    let {car_id} = req.params;
    let read = `select * from cab where car_id = '${car_id}' `
    connection.query(read, (error, record) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',record:record})
        }
    })
}

function Bookings(req, res) {
    //console.log(req['userInfo'])
 // console.log(req.body)
    const {id} = req['userInfo']
    const {paymentId,startDate,endDate,totalAmount,bookCarId,days,fullName,email,phone,booked} =req.body;
    let insert = `insert into bookings (user_id,car_id,payment_id,email,phone,fullName,amount,days,startDate,endDate,booked) values (?,?,?,?,?,?,?,?,?,?,?)`;
    connection.query(insert,[id,bookCarId,paymentId,email,phone,fullName,totalAmount,days,startDate,endDate,booked], (error) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',message:'Car Booked'})
        }
    })
}

function UserBookings(req,res){
    let {id} = req['userInfo']
    //console.log(id)
    let get = `SELECT * FROM bookings as b join cab on b.car_id= cab.car_id where b.user_id =${id}`
    connection.query(get, (error, record) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',record:record})
        }
    })
}

module.exports = {

    UserLogin,
    UserSignup,
    UserChangePassword,
    UserForgotPassword,
    UserChangeForgotPassword,
    UserVerifyOtp,
    ReadSearchTaxi,
    UserData,
    ReadSearchTaxiBook,
    Bookings,
    UserBookings,
}