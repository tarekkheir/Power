const { Product } = require("../models/product.model");
const { Cart } = require("../models/cart.model");
const { Op } = require('sequelize');
const { User } = require("../models/user.model");
const { Historic } = require("../models/historic.model");

const sessionController = {
  add_to_cart: (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length > 8) return res.send({ message: 'too much parameters', success: false });
    const { quantity, product_id, user_id, name, shop_id, expire_date, price, fileName } = req.body;
    if (!name || !quantity || !product_id || !user_id || !shop_id || !expire_date || !price || !fileName) {
      return res.status(501).send({ message: 'missing parameters', success: false });
    }

    Product.findAll({ where: { id: product_id, shop_id: shop_id } })
      .then((product) => {
        if (Object.keys(product).length) {
          const new_quantity = Number(product[0].dataValues.quantity) - quantity;
          if (new_quantity >= 0) {

            Cart.findAll({ where: { user_id: user_id, product_id: product_id } })
              .then((cart) => {

                if (Object.keys(cart).length) {
                  const cart_quantity = Number(cart[0].dataValues.quantity) + Number(quantity);

                  Cart.update({ quantity: cart_quantity, expire_date: Number(expire_date) },
                    { where: { [Op.and]: [{ user_id: user_id, product_id: product_id }] } })
                    .then((cart) => {

                      if (cart) {
                        Product.update({ quantity: new_quantity }, { where: { [Op.and]: [{ shop_id: shop_id, id: product_id }] } })
                          .then((product) => {

                            if (product) return res.status(200).send({ message: 'cart update successfully !', success: true });
                            else return res.status(200).send({ message: 'no update done', success: false });
                          })
                          .catch((err) => {
                            console.log('error on adding product to cart: ', err);
                            return res.status(200).send({ message: 'error on adding product to cart', success: false });
                          })
                      }
                      else return res.status(200).send({ message: 'no updated on cart', success: false });
                    })
                    .catch((err) => {
                      console.log('error on cart update: ', err);
                      return res.status(200).send({ message: 'error on cart update', success: false });
                    })
                } else {
                  Cart.create({
                    quantity: quantity,
                    product_id: product_id,
                    user_id: user_id,
                    name: name,
                    expire_date: Number(expire_date),
                    price: price,
                    shop_id: shop_id,
                    fileName: fileName
                  })
                    .then((cart) => {

                      Product.update({ quantity: new_quantity }, { where: { [Op.and]: [{ shop_id: shop_id, id: product_id }] } })
                        .then((product) => {

                          if (product) return res.status(200).send({ message: 'cart added successfully !', success: true });
                          else return res.status(200).send({ message: 'no update done', success: false });
                        })
                        .catch((err) => {
                          console.log('error on adding product to cart: ', err);
                          return res.status(200).send({ message: 'error on adding product to cart', success: false });
                        })
                    })
                    .catch((err) => {
                      console.log('error on adding to cart', err);
                      return res.status(200).send({ message: 'error on adding to cart', success: false });
                    })
                }
              })
              .catch((err) => {
                console.log('error on finding product in cart: ', err);
                return res.status(200).send({ message: 'error on finding product in cart', success: false });
              })
          } else return res.status(200).send({ message: 'too much quantity', success: false });
        } else return res.status(200).send({ message: 'no product found for this id', success: false });
      })
      .catch((err) => {
        console.log('error on finding product: ', err);
        return res.status(200).send({ message: 'error on finding product', success: false });
      })
  },

  get_my_cart: (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(200).send({ message: 'missing parameters', success: false });

    Cart.findAll({ where: { user_id: id } })
      .then((products) => {
        if (Object.keys(products).length) {
          const datas = [];
          products.map((product) => {
            const { name, expire_date, quantity, price, product_id, shop_id, fileName } = product.dataValues;
            datas.push({ name, quantity, expire_date, price, product_id, shop_id, fileName });
          })
          return res.status(200).send({ datas, success: true });
        } else return res.status(200).send({ message: 'You have no products in your Cart', success: false });
      })
      .catch((err) => {
        console.log('error on getting cart: ', err);
        return res.status(200).send({ message: 'Error on finding cart', success: false });
      })
  },

  delete_from_cart: (req, res) => {
    if (Object.keys(req.body).length > 4) return res.send({ message: 'too much parameters', success: false });
    const { product_id, user_id, quantity, shop_id } = req.body;
    console.log(req.body);
    if (!product_id || !user_id || !quantity || !shop_id) return res.status(200).send({ message: 'missing parameters', success: false });

    Product.findAll({ where: { id: product_id, shop_id: shop_id } })
      .then((product) => {
        if (Object.keys(product).length) {

          Cart.findAll({ where: { product_id: product_id, user_id: user_id, shop_id: shop_id } })
            .then((cart) => {
              if (Object.keys(cart).length) {
                const total = Number(product[0].dataValues.quantity) + Number(quantity);

                Product.update({ quantity: total }, { where: { id: product_id, shop_id: shop_id } })
                  .then((product) => {
                    if (!product) return res.status(200).send({ message: 'Product update but Cart fail to update...', success: false });
                  })
                  .catch((err) => {
                    console.log('error on product update: ', err);
                    return res.status(200).send({ message: 'error on product update', success: false });
                  })

                Cart.destroy({ where: { user_id: user_id, product_id: product_id, shop_id: shop_id } })
                  .then((cart) => {
                    if (!cart) return res.status(200).send({ message: 'Cart fail to destroy', success: false });
                  })
                  .catch((err) => {
                    console.log('error on cart destroy: ', err);
                    return res.status(200).send({ message: 'error on cart destroy', success: false });
                  })

                return res.status(200).send({ message: 'Deleted from the Cart successfully !', success: true });

              } else return res.status(200).send({ message: 'no product find in cart', success: false });
            })
            .catch((err) => {
              console.log('error on findind cart product: ', err);
              return res.status(200).send({ message: 'error on findind cart product', success: false });
            })
        } else return res.status(200).send({ message: 'No product find...', success: false });
      })
      .catch((err) => {
        console.log('error on finding product: ', err);
        return res.status(200).send({ message: 'error on finding product', success: false });
      })
  },

  buy_cart: (req, res) => {
    if (Object.keys(req.body).length > 3) return res.send({ message: 'too much parameters', success: false });
    const { products, user_id, totalPrice } = req.body;
    if (!products || !user_id || !totalPrice) return res.status(200).send({ message: 'missing parameters', success: false });

    User.findAll({ where: { id: user_id } })
      .then((user) => {
        if (Object.keys(user).length > 0) {
          const { money } = user[0].dataValues;
          if (money < totalPrice) {
            return res.status(200).send({ message: 'not enough money to buy cart...', success: false });
          } else {
            Cart.destroy({ where: { user_id: user_id } })
              .then((cart) => {
                if (!cart) return res.status(200).send({ message: 'fail to destroy cart in then...', success: false });
                else {

                  User.update({ money: money - totalPrice }, { where: { id: user_id } })
                    .then((user) => {
                      if (user) {
                        const json_products = {};

                        products.map((product) => {
                          const { product_id, shop_id, name, quantity } = product;
                          const price = parseFloat(product.price).toFixed(2);
                          json_products[name] = { name, product_id, shop_id, quantity, price };
                        })

                        Historic.create({ products: json_products, user_id, total: totalPrice })
                          .then((history) => {
                            if (!Object.keys(history.dataValues).length) return res.status(200).send({ message: 'Fail to create history', success: false });
                            return res.status(200).send({ message: 'History created successfully !', success: true })
                          })
                          .catch((err) => {
                            console.log('error on create historic...: ', err);
                            return res.status(200).send({ message: 'error on create historic...', success: false });
                          })
                      } else return res.status(200).send({ message: 'user money update failed...', success: false });
                    })
                    .catch((err) => {
                      console.log('error on user money update: ', err);
                      return res.status(200).send({ message: 'error on user money update', success: false });
                    })
                }
              })
              .catch((err) => {
                console.log('fail to destroy cart...: ', err);
                return res.status(200).send({ message: 'fail to destroy cart...', success: false });
              })

          }
        } else return res.status(200).send({ message: 'no user found for this id...', success: false });
      })
      .catch((err) => {
        console.log('fail to find user...', err);
        return res.status(200).send({ message: 'fail to find user...', success: false });
      })

  }

}

module.exports = sessionController;