const passport = require('passport');
require('../config/passport')(passport);

const { isAuth } = require('../services/utils');

const express = require('express');
const router = express.Router();


const authRouter = require('./auth.router');
const userRouter = require('./user.router');
const commonRouter = require('./common.router');

router.get('/v1/', (req, res) => {
    res.send('Welcome!')
});

router.use('/v1/common', commonRouter);
router.use('/v1/auth', authRouter);
router.use('/v1/user', isAuth, userRouter);

module.exports = router;