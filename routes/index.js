const express = require('express');
const router = express.Router();
const indexController = require("../controllers/index.controller")

router.delete('/', (req, res) => {

})

router.post('/', (req, res) => {

})

router.get('/', (req, res) => {
    res.render('index')
})


module.exports = router;