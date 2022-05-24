const { Product } = require('../models/product.model');
const { Shop } = require('../models/shop.model');
const { ProductComment } = require('../models/productComment.model');
const { Op } = require('sequelize');
const fs = require('fs');
require('dotenv').config();


const productController = {
  add_product: (req, res) => {
    console.log(req.file);
    console.log(req.headers);
    console.log(req.body);
    if (Object.keys(req.body).length > 6) return res.status(200).send({ message: 'too much parameters', success: false });
    const { name, price, type, boss_id, quantity, description } = req.body;
    if (!name || !price || !type || !boss_id || !description) {
      return res.status(200).send({ message: 'missing parameters', success: false });
    }


    Shop.findAll({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (!Object.keys(shop).length) {
          return res.status(200).send({ message: 'you have no shop', success: false });
        } else {
          const shop_id = shop.map((s) => {
            const { id } = s.dataValues;
            return id;
          });

          Product.findAll({
            where: { [Op.and]: [{ name: name }, { boss_id: boss_id }] }
          })
            .then((product) => {
              if (Object.keys(product).length) {
                return res.status(200).send({ message: 'product name already exist', success: false });
              } else {
                Product.create({
                  name: name,
                  price: price,
                  type: type,
                  boss_id: boss_id,
                  shop_id: shop_id,
                  quantity: quantity,
                  description: description,
                  fileName: req.file.originalname,
                })
                  .then((product) => {
                    if (product) return res.status(200).send({ message: 'Product added successfully !', success: true });
                    else return res.status(200).send({ message: 'fail to add product', success: false });
                  })
                  .catch((err) => {
                    console.log('error on product creation');
                    console.log(err);
                    return res.status(200).send({ message: 'error on product creation', success: false });
                  })
              }
            })
            .catch((err) => {
              console.log('error on finding Product');
              console.log(err);
              return res.status(200).send({ message: 'error on finding product', success: false });
            })
        }
      })
      .catch((err) => {
        console.log('error on finding shop for adding product');
        console.log(err);
        return res.status(200).send({ message: 'error on finding shop for adding product', success: false });
      })

  },

  delete_product: (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length > 4) return res.status(501).send({ message: 'too much parameters', success: false });
    const { boss_id, id, shop_id, fileName } = req.body;
    if (!boss_id || !id || !shop_id || !fileName) {
      return res.status(501).send({ message: 'missing parameters', success: false });
    }

    Product.destroy({ where: { [Op.and]: [{ boss_id: boss_id }, { id: id }] } })
      .then((product) => {
        if (product) {
          console.log('product deleted');

          ProductComment.destroy({ where: { shop_id: shop_id } })
            .then((comment) => {
              if (comment) {
                console.log('comments deleted');

                const product_image = process.env.DIR_PRODUCTS + fileName;

                fs.unlink(product_image, (err) => {
                  if (err) {
                    console.log('error on product image delete: ', err)
                    return res.status(200).send({ message: 'error on product image delete', success: false });
                  } else console.log('product image deleted: ', product_image);
                });

                return res.status(200).send({ message: 'Product deleted successfully !', success: true });
              } else return res.status(200).send({ message: 'no comment to delete', success: false });
            })
            .catch((err) => {
              console.log('error on comment deleted', err);
              return res.status(200).send({ message: 'error on comment deleted', success: false });
            })

        } else {
          console.log('no product to delete');
          return res.status(200).send({ message: 'no product to delete', success: false });
        }
      })
      .catch((err) => {
        console.log('error on product delete', err);
        return res.status(200).send({ message: 'error on product delete', success: false })
      })

  },

  update_product: (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if (Object.keys(req.body).length > 8) return res.send({ message: 'too much parameters', success: false });
    const { name, boss_id, quantity, price, product_id, type, description } = req.body;
    if (!name || !boss_id || !quantity || !price || !product_id || !type || !description) {
      return res.status(200).send({ message: 'missing parameters' });
    }

    Product.findAll({ where: { [Op.and]: [{ id: product_id }, { boss_id: boss_id }] } })
      .then((product) => {
        if (Object.keys(product).length) {
          const { fileName } = product[0].dataValues;

          if (req.file) {
            const product_image = process.env.DIR_PRODUCTS + fileName;

            fs.unlink(product_image, (err) => {
              if (err) {
                console.log('error on delete image: ', err)
              } else console.log('shop image deleted');
            });
          }

          const fileName_update = req.file ? req.file.originalname : fileName;

          Product.update({ description, quantity, price, name, type, fileName: fileName_update },
            { where: { [Op.and]: [{ id: product_id }, { boss_id: boss_id }] } })
            .then((product) => {
              console.log(product);
              if (product != 0) {
                console.log('Product quantity updated');
                return res.status(200).send({ message: 'Product quantity updated successfully !', success: true });
              } else {
                console.log('no update done');
                return res.status(501).send({ message: 'no update done', success: false });
              }
            })
            .catch((err) => {
              console.log('error on product quantity update');
              console.log(err);
              return res.status(501).send({ message: 'error on product quantity update', success: false })
            })
        }
      })
  },

  get_shop_products: (req, res) => {
    if (Object.keys(req.body).length > 1) return res.send({ message: 'too much parameters', success: false });
    const { id } = req.params;
    if (!id) {
      return res.status(501).send({ message: 'missing parameters', success: false });
    }

    Shop.findAll({ where: { id: id } })
      .then((shop) => {
        if (!Object.keys(shop).length) return res.status(501).send({ message: 'no shop found for this name', success: false });
        else {
          const shop_id = shop[0].dataValues.id;
          const shop_name = shop[0].dataValues.name;

          Product.findAll({ where: { shop_id: shop_id } })
            .then((product) => {
              if (!product) return res.status(501).send({ message: 'no product found for this shop', success: false });
              else {
                const products = [];
                product.map((p) => {
                  const { name, price, type, quantity, id, description, reviews, star_rating } = p.dataValues;

                  products.push({ name, price, type, quantity, id, description, product_image, reviews, star_rating });
                });
                return res.send({ products, success: true, shop_name });
              }
            })
        }
      })
      .catch((err) => {
        console.log('error on finding shop name');
        console.log((err));
        return res.status(501).send({ message: 'error on finding shop name', success: false });
      })
  },

  get_product_by_id: (req, res) => {
    if (Object.keys(req.body).length > 1) return res.send({ message: 'too much parameters', success: false });
    const { id } = req.params;
    if (!id) { return res.status(200).send({ message: 'missing parameters', success: false }) };

    Product.findAll({ where: { id: id } })
      .then((product) => {
        if (!product) return res.status(200).send({ message: 'no product found for this shop', success: false });
        const { name, price, type, quantity, id, shop_id, description, fileName, reviews, star_rating } = product[0].dataValues;

        return res.status(200).send({ shop_id, name, price, type, quantity, id, description, fileName, reviews, star_rating, success: true });
      })
      .catch((err) => {
        console.log('error on finding product by id', err);
        return res.status(200).send({ message: 'error on finding product', success: false });
      })
  },

  add_star_rating: (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length > 2) return res.send({ message: 'too much parameters', success: false });
    const { productsData } = req.body;
    if (!productsData.length) { return res.status(200).send({ message: 'missing parameters', success: false }) };

    productsData.map((p) => {
      const { product_id, rating } = p;

      Product.findAll({ where: { id: product_id } })
        .then((product) => {
          if (Object.keys(product).length) {
            const { star_rating, reviews } = product[0].dataValues;
            const new_rating = star_rating + rating;
            const new_reviews = reviews + 1;

            Product.update({ star_rating: new_rating, reviews: new_reviews }, { where: { id: product_id } })
              .then((result) => {
                if (result) return res.status(200).send({ message: 'Rating added successfully', success: true });
                else return res.status(200).send({ message: 'Rating failed...', success: false });
              })
              .catch((err) => {
                console.log('Error on update product: ', err);
                return res.status(200).send({ message: 'Error on update product', success: false });
              })
          }
        })
        .catch((err) => {
          console.log('Error on finding product: ', err);
          return res.status(200).send({ message: 'Error on finding Product', success: false });
        })
    })
  }
}

module.exports = productController;
