const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createMenuRules } = require('../validators/menuValidator');

router.get('/', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);

// Admin-protected routes
router.use(protect, restrictTo('admin'));
router.post('/', createMenuRules, validate, menuController.createMenuItem);
router.put('/:id', createMenuRules, validate, menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
