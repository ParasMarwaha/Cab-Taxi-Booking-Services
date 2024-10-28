const connection = require('../db/connection');
const {sign} = require('jsonwebtoken')
const nodemailer = require("nodemailer");

function AdminLogin(req, res) {
    const {email, password} = req.body;
    let loginQuery = `select * from admin where email='${email}' and password='${password}'`;
    connection.query(loginQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record.length === 0) {
                res.json({error: 'Invalid email or password'});
            } else {
                let payload = {
                    id: record[0].id,
                    email: record[0].email,
                    name: record[0].name,
                }
                let secret = "abc@123"
                let expiry = 60 * 60
                let token = sign(payload, secret, {expiresIn: expiry})
                res.cookie('adminToken', token, {
                    expires: new Date(Date.now() + expiry * 1000)
                })
                res.json({error: '', message: 'Login successful'});
            }
        }
    })
}

function AdminChangePassword(req, res) {
    const {id} = req.params
    const {oldPassword, newPassword} = req.body;
    let checkQuery = `select * from admin where id=${id}`
    connection.query(checkQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].password !== oldPassword) {
                res.json({error: 'Old Password do not match', message: ''});
            } else {
                let changeQuery = `update admin set password='${newPassword}' where id=${id}`
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

function AdminForgotPassword(req, res) {
    {
        const {email} = req.body
        let l = 100000;
        let u = 999999;
        let OTP = Math.floor(l + (u - l) * Math.random());
        let insertQuery = `select * from admin where email='${email}'`;
        connection.query(insertQuery, (error, record) => {
            if (error) {
                res.json({error: error.message, message: ''});
            } else {
                if (record.length === 0) {
                    res.json({error: 'Email does not Exist', message: ''});
                } else {
                    let updateQuery = `update admin set otp='${OTP}' where email='${email}'`;
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

function AdminVerifyOtp(req, res) {
    const {email, otp} = req.body
    let selectQuery = `select * from admin where email='${email}'`;
    connection.query(selectQuery, (error, record) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            if (record[0].otp !== otp) {

                res.json({error: 'OTP does not Matched', message: ''});
            } else {

                let nullQuery = `update admin set otp=NULL`;
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

function AdminChangeForgotPassword(req, res) {
    const {newPassword, email} = req.body
    let updateQuery = `update admin set password='${newPassword}' where email='${email}'`;
    connection.query(updateQuery, (error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        } else {
            res.json({error: '', message: 'Password Changed Successfully'})
        }
    })
}

function AddTaxi(req, res) {
   // console.log(req.body)
   // console.log(req.files)
    let {name,brand,type,desc,fuel,rent,rentD,color,model,regNo,seats,auto,ac} = req.body;
    let {image} = req.files;
    let serverImg = `public/assets/img/Car/${image.name}`
    let dbPath = `/img/Car/${image.name}`
    image.mv(serverImg, (err, image) => {
        if (err) {
            res.json({error: err.message});
        }
        else {
            let insert = `insert into cab (name,brand,type,description,fuel,rent,rent_driver,color,register_no,model,ac,seater,transmission,image) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            connection.query(insert,[name,brand,type,desc,fuel,rent,rentD,color,regNo,model,ac,seats,auto,dbPath] ,(error) => {
                if (error) {
                    res.json({error: error.message, message: ''});
                }
                else {
                    res.json({error:'',message:'Vehicle Added Successfully'})
                }
            })
        }
    })
}

function ReadTaxi(req, res) {
    let read = `select * from cab`
    connection.query(read, (error, record) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',record:record})
        }
    })
}

function UpdateTaxi(req, res) {
    //console.log(req.params)
    let {car_id} = req.params;
    let read = `select * from cab where car_id = ${car_id} `
    connection.query(read, (error, record) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',record:record})
        }
    })
}

function UpdateCar(req, res) {
    //console.log(req.body)
    let {name,brand,type,desc,fuel,rent,rentD,color,model,regNo,seats,auto,ac,car_id} = req.body;
let update = `update cab set name = ?,brand = ?,type= ?,description= ?,fuel= ?,rent= ?,rent_driver= ?,color= ?,register_no= ?,model= ?,ac = ?,seater= ?,transmission= ? where car_id = ${car_id} `
    connection.query(update,[name,brand,type,desc,fuel,rent,rentD,color,regNo,model,ac,seats,auto] ,(error) => {
        if (error) {
            res.json({error: error.message, message: ''});
        }
        else {
            res.json({error:'',message:'Vehicle Updated Successfully'})
        }
    })
}

function DeleteCar(req, res) {
    let {id} = req.params;
    // console.log(id)
    let Delete = `delete from cab where car_id = ${id}`;
    //console.log(Delete)
    connection.query(Delete, (error) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',message:'Vehicle Deleted Successfully'})
        }
    })
}

function AllUserBookings(req,res){
    let{id} = req['adminInfo']
    // console.log(id)
    let get = `SELECT b.*,cab.*,user.name as UserName FROM bookings as b join cab on b.car_id= cab.car_id join user on b.user_id=user.id order by startDate desc`
    connection.query(get, (error, record) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',record:record})
        }
    })
}

function UserDetails(req,res){
    let{user_id} = req.params;
    //console.log(user_id)
    let read = `select * from user where id = ${user_id} `
    connection.query(read, (error, record) => {
        if (error) {
            res.json({error: error.message});
        }
        else{
            res.json({error:'',record:record})
        }
    })
}


module.exports = {
    AdminLogin,
    AdminChangePassword,
    AdminForgotPassword,
    AdminVerifyOtp,
    AdminChangeForgotPassword,
    AddTaxi,
    ReadTaxi,
    UpdateTaxi,
    UpdateCar,
    DeleteCar,
    AllUserBookings,
    UserDetails
}
