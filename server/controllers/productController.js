const { Product } = require('../models/product.model');
const { Shop } = require('../models/shop.model');
const { Op } = require('sequelize');
require('dotenv').config();


const productController = {
  add_product: (req, res) => {
    if (Object.keys(req.body).length > 5) return res.status(501).send({ message: 'too much parameters' });
    const { name, price, type, boss_id, quantity } = req.body;
    if (!name || !price || !type || !boss_id) {
      return res.status(501).send({ message: 'missing parameters' });
    }
    console.log(boss_id);

    Shop.findAll({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (!Object.keys(shop).length) {
          return res.status(501).send({ message: 'you have no shop' });
        } else {
          const shop_id = shop.map((s) => {
            const { id } = s.dataValues;
            return id;
          });

          Product.findAll({ where: { name: name } })
            .then((product) => {
              if (Object.keys(product).length) {
                return res.status(501).send({ message: 'product name already exist' });
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
                    if (product) return res.status(200).send({ message: 'Product added successfully !' });
                    else return res.status(501).send({ message: 'fail to add product' });
                  })
                  .catch((err) => {
                    console.log('error on product creation');
                    console.log(err);
                    return res.status(501).send({ message: 'error on product creation' });
                  })
              }
            })
            .catch((err) => {
              console.log('error on finding Product');
              console.log(err);
              return res.status(501).send({ message: 'error on finding product' });
            })
        }
      })
      .catch((err) => {
        console.log('error on finding shop for adding product');
        console.log(err);
        return res.status(501).send({ message: 'error on finding shop for adding product' });
      })

  },

  delete_product: (req, res) => {
    if (Object.keys(req.body).length > 3) return res.status(501).send({ message: 'too much parameters' });
    const { boss_id, name, product_id } = req.body;
    if (!boss_id || !name || !product_id) {
      return res.status(501).send({ message: 'missing parameters' });
    }

    Product.destroy({ where: { [Op.and]: [{ boss_id: boss_id }, { name: name }] } })
      .then((product) => {
        if (product) {
          console.log('product deleted');
          return res.status(200).send({ 'Product deleted': product_id });
        } else {
          console.log('no product to delete');
          return res.status(501).send({ message: 'no product to delete' });
        }
      })
      .catch((err) => {
        console.log('error on product delete');
        console.log((err));
        return res.status(501).send({ message: 'error on product delete' })
      })

  },

  update_product: (req, res) => {
    if (Object.keys(req.body).length > 5) return res.send({ message: 'too much parameters' });
    const { name, boss_id, quantity, price, product_id } = req.body;
    if (!name || !boss_id || !quantity || !price || !product_id) {
      return res.status(501).send({ message: 'missing parameters' });
    }

    Product.update({ quantity: quantity, price: price, name: name }, { where: { [Op.and]: [{ id: product_id }, { boss_id: boss_id }] } })
      .then((product) => {
        console.log(product);
        if (product != 0) {
          console.log('Product quantity updated');
          return res.status(200).send({ message: 'Product quantity updated' });
        } else {
          console.log('no update done');
          return res.status(501).send({ message: 'no update done' });
        }
      })
      .catch((err) => {
        console.log('error on product quantity update');
        console.log(err);
        return res.status(501).send({ message: 'error on product quantity update' })
      })
  },

  get_shop_products: (req, res) => {
    if (Object.keys(req.body).length > 1) return res.send({ message: 'too much parameters' });
    const { id } = req.params;
    if (!id) {
      return res.status(501).send({ message: 'missing parameters' });
    }

    Shop.findAll({ where: { id: id } })
      .then((shop) => {
        if (!Object.keys(shop).length) return res.status(501).send({ message: 'no shop found for this name' });
        else {
          const shop_id = shop.map((s) => {
            const { id } = s.dataValues;
            return id
          });

          Product.findAll({ where: { shop_id: shop_id } })
            .then((product) => {
              if (!product) return res.status(501).send({ message: 'no product found for this shop' });
              else {
                const products = [];

                product.map((p) => {
                  const { name, price, type, quantity, id } = p.dataValues;
                  products.push({ name, price, type, quantity, id });
                });
                return res.send(products);
              }
            })
        }
      })
      .catch((err) => {
        console.log('error on finding shop name');
        console.log((err));
        return res.status(501).send({ message: 'error on finding shop name' });
      })
  }
}

module.exports = productController;
