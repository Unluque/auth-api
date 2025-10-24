const express = require('express');
const registerRouter = require('./registerRoutes');
const verifyRouter = require('./verifyRoutes');
const loginRouter = require('./loginRoutes');
const sessionRouter = require('./sessionRoutes');
const logoutRouter = require('./logoutRoutes');
const testRouter = require('./testRoutes');

const router = express.Router();

router.use('/register', registerRouter);
router.use('/verify', verifyRouter);
router.use('/login', loginRouter);
router.use('/session', sessionRouter);
router.use('/logout', logoutRouter);
router.use('/test', testRouter);

module.exports = router;