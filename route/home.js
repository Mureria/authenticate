const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");

router.post('/', auth, (req, res) => {
    res.status(200).send('Welcome to the Home page')
});

module.exports = router