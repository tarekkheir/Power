const usersController = require('../controllers/usersController');
const shopController = require('../controllers/shopController');
const productController = require('../controllers/productController');
const sessionController = require('../controllers/sessionController');
const historicController = require('../controllers/historicController');
const productCommentController = require('../controllers/productCommentController');
const { authUser, authModerator, authAdmin } = require('../middlewares/authUser');
const express = require('express');
const multer = require('multer');
require('dotenv').config();


const storage_product = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.DIR_PRODUCTS);
  },
  filename: (req, file, cb) => {
    console.log(file);
    let name = null;
    if (file !== null) name = file.originalname;
    cb(null, `${name}`)
  },
})

const upload_product = multer({ storage: storage_product });


const storage_shop = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.DIR_SHOPS);
  },
  filename: (req, file, cb) => {
    console.log('file: ', file);
    let name = null;
    if (file !== null) name = file.originalname;
    cb(null, `${file.originalname}`)
  },
})

const upload_shop = multer({ storage: storage_shop });


// Router
const router = express.Router();
// Users routes
router.post('/signup', usersController.signUp);
router.post('/login', usersController.login);
router.post('/update_user_details', authUser, usersController.update_user_details);
router.get('/user_details', authUser, usersController.get_user_details);
// Shop routes
router.post('/update_shop_details', authModerator, upload_shop.single('file'), shopController.update_shop_details);
router.post('/add_shop', authModerator, upload_shop.single('file'), shopController.add_shop);
router.post('/delete_shop', authModerator, shopController.delete_shop);
router.get('/shops', shopController.get_all_shop_details);
router.get('/shop/:id', shopController.get_shop_by_id);
router.get('/myshop/:id', shopController.get_shop_details);
// Products routes
router.post('/add_product', authModerator, upload_product.single('file'), productController.add_product);
router.post('/delete_product', authModerator, productController.delete_product);
router.post('/update_product', authModerator, upload_product.single('file'), productController.update_product);
router.get('/shop_products/:id', authUser, productController.get_shop_products);
router.get('/product/:id', productController.get_product_by_id);
// Cart routes
router.post('/add_to_cart', sessionController.add_to_cart);
router.post('/delete_from_cart', sessionController.delete_from_cart);
router.post('/buy_cart', sessionController.buy_cart);
router.get('/mycart/:id', sessionController.get_my_cart);
// Historic routes
router.get('/historic', authUser, historicController.get_historic);
// Product Comments
router.post('/add_comment', authUser, productCommentController.add_comment);
router.post('/delete_comment/:comment_id', authUser, productCommentController.delete_comment);
router.post('/add_star_rating', productController.add_star_rating);
router.get('/get_all_comments/:id', authUser, productCommentController.get_all_comments);


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
