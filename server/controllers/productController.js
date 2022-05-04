const { Product } = require('../models/product.model');
const { Shop } = require('../models/shop.model');
const { Op } = require('sequelize');
require('dotenv').config();


const productController = {
  add_product: (req, res) => {
    if (Object.keys(req.body).length > 5) return res.status(501).send({ message: 'too much parameters', success: false });
    const { name, price, type, boss_id, quantity } = req.body;
    if (!name || !price || !type || !boss_id) {
      return res.status(501).send({ message: 'missing parameters', success: false });
    }
    console.log(boss_id);

    Shop.findAll({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (!Object.keys(shop).length) {
          return res.status(501).send({ message: 'you have no shop', success: false });
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
                return res.status(501).send({ message: 'product name already exist', success: false });
              } else {
                Product.create({
                  name: name,
                  price: price,
                  type: type,
                  boss_id: boss_id,
                  shop_id: shop_id,
                  quantity: quantity
                })
                  .then((product) => {
                    if (product) return res.status(200).send({ message: 'Product added successfully !', success: true });
                    else return res.status(501).send({ message: 'fail to add product' });
                  })
                  .catch((err) => {
                    console.log('error on product creation');
                    console.log(err);
                    return res.status(501).send({ message: 'error on product creation', success: false });
                  })
              }
            })
            .catch((err) => {
              console.log('error on finding Product');
              console.log(err);
              return res.status(501).send({ message: 'error on finding product', success: false });
            })
        }
      })
      .catch((err) => {
        console.log('error on finding shop for adding product');
        console.log(err);
        return res.status(501).send({ message: 'error on finding shop for adding product', success: false });
      })

  },

  delete_product: (req, res) => {
    if (Object.keys(req.body).length > 2) return res.status(501).send({ message: 'too much parameters', success: false });
    const { boss_id, id } = req.body;
    if (!boss_id || !id) {
      return res.status(501).send({ message: 'missing parameters', success: false });
    }

    Product.destroy({ where: { [Op.and]: [{ boss_id: boss_id }, { id: id }] } })
      .then((product) => {
        if (product) {
          console.log('product deleted');
          return res.status(200).send({ message: 'Product deleted successfully !', success: true });
        } else {
          console.log('no product to delete');
          return res.status(200).send({ message: 'no product to delete', success: false });
        }
      })
      .catch((err) => {
        console.log('error on product delete');
        console.log((err));
        return res.status(200).send({ message: 'error on product delete', success: false })
      })

  },

  update_product: (req, res) => {
    if (Object.keys(req.body).length > 6) return res.send({ message: 'too much parameters', success: false });
    const { name, boss_id, quantity, price, product_id, type } = req.body;
    if (!name || !boss_id || !quantity || !price || !product_id || !type) {
      return res.status(501).send({ message: 'missing parameters' });
    }

    Product.update({ quantity: quantity, price: price, name: name, type: type }, { where: { [Op.and]: [{ id: product_id }, { boss_id: boss_id }] } })
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
          const shop_id = shop.map((s) => {
            const { id } = s.dataValues;
            return id
          });

          Product.findAll({ where: { shop_id: shop_id } })
            .then((product) => {
              if (!product) return res.status(501).send({ message: 'no product found for this shop', success: false });
              else {
                const products = [];

                product.map((p) => {
                  const { name, price, type, quantity, id } = p.dataValues;
                  products.push({ name, price, type, quantity, id });
                });
                return res.send({ products, success: true });
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
        const { name, price, type, quantity, id, shop_id } = product[0].dataValues;
        return res.status(200).send({ shop_id, name, price, type, quantity, id, success: true });
      })
      .catch((err) => {
        console.log('error on finding product by id', err);
        return res.status(200).send({ message: 'error on finding product', success: false });
      })
  }
}

module.exports = productController;
