const usersController = require('../controllers/usersController');
const shopController = require('../controllers/shopController');
const productController = require('../controllers/productController');
const { authUser, authModerator, authAdmin } = require('../middlewares/authUser');
const express = require('express');


// Router
const router = express.Router();
// Users routes
router.post('/signup', usersController.signUp);
router.post('/login', usersController.login);
// Shop routes
router.post('/add_shop', authModerator, shopController.add_shop);
router.post('/delete_shop', authModerator, shopController.delete_shop);
router.post('/update_shop_details', authModerator, shopController.update_shop_details);
router.get('/shops', shopController.get_all_shop_details);
router.get('/shop/:id', shopController.get_shop_by_id);
// Products routes
router.post('/add_product', authModerator, productController.add_product);
router.post('/delete_product', authModerator, productController.delete_product);
router.post('/update_product', authModerator, productController.update_product);
router.post('/shop_products', authUser, productController.get_shop_products);




router.get('/home', authUser, (req, res) => {
    console.log(req.body);
    return res.send({ 'OK': 'This is the home page !' });
});
router.get('/moderator', authModerator, (req, res) => {
    return res.send({ 'OK': 'This is the moderator page' });
});
router.get('/admin', authAdmin, (req, res) => {
    return res.send({ 'OK': 'This is the admin page' });
})

module.exports = router;
