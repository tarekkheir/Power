const { Product } = require("../models/product.model");
const { Cart } = require("../models/cart.model");
const { Op } = require('sequelize');

const sessionController = {
  add_to_cart: (req, res) => {
    if (Object.keys(req.body).length > 7) return res.send({ message: 'too much parameters', success: false });
    const { quantity, product_id, user_id, name, shop_id, expire_date, price } = req.body;
    if (!name || !quantity || !product_id || !user_id || !shop_id || !expire_date || !price) {
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

                  Cart.update({ quantity: cart_quantity, expire_date: Number(expire_date) }, { where: { [Op.and]: [{ user_id: user_id, product_id: product_id }] } })
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
                  Cart.create({ quantity: quantity, product_id: product_id, user_id: user_id, name: name, expire_date: Number(expire_date), price: price, shop_id: shop_id })
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
            const { name, expire_date, quantity, price, product_id, shop_id } = product.dataValues;
            datas.push({ name, quantity, expire_date, price, product_id, shop_id });
          })
          return res.status(200).send({ datas, success: true });
        } else return res.status(200).send({ message: 'You have no products in your Cart', success: false });
      })
      .catch((err) => {
        console.log('error on getting cart: ', err);
        return res.status(200).send({ message: 'Error on finding cart', success: false });
      })
  }

}

module.exports = sessionController;