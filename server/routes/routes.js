const usersController = require('../controllers/usersController');
const shopController = require('../controllers/shopController');
const productController = require('../controllers/productController');
const sessionController = require('../controllers/sessionController');
const { authUser, authModerator, authAdmin } = require('../middlewares/authUser');
const express = require('express');


// Router
const router = express.Router();
// Users routes
router.post('/signup', usersController.signUp);
router.post('/login', usersController.login);
router.post('/update_user_details', authUser, usersController.update_user_details);
// Shop routes
router.post('/add_shop', authModerator, shopController.add_shop);
router.post('/delete_shop', authModerator, shopController.delete_shop);
router.post('/update_shop_details', authModerator, shopController.update_shop_details);
router.get('/shops', shopController.get_all_shop_details);
router.get('/shop/:id', shopController.get_shop_by_id);
router.get('/myshop/:id', shopController.get_shop_details);
// Products routes
router.post('/add_product', authModerator, productController.add_product);
router.post('/delete_product', authModerator, productController.delete_product);
router.post('/update_product', authModerator, productController.update_product);
router.get('/shop_products/:id', authUser, productController.get_shop_products);
router.get('/product/:id', productController.get_product_by_id);
// Cart routes
router.post('/add_to_cart', sessionController.add_to_cart);
router.post('/delete_from_cart', sessionController.delete_from_cart);
router.get('/mycart/:id', sessionController.get_my_cart);




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
