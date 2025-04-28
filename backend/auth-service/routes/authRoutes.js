// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/authController');

// router.post('/register', controller.register);
// router.post('/login', controller.login);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { register, verifyOTP, login, updateLocation, getAllUserById, getUserById } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.put('/users/:id/location', updateLocation);
router.get('/users/all/:id', getAllUserById);
router.get('/users/:id', getUserById);
module.exports = router;
