const express = require('express');
const router = express.Router();
const controller = require('../controllers/menuController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth.verifyToken, controller.addMenuItem);
router.put('/:id', auth.verifyToken, controller.updateMenuItem);
router.delete('/:id', auth.verifyToken, controller.deleteMenuItem);

module.exports = router;
