const { Fav } = require('../models/favoris.model');
const { Op } = require('sequelize');
require('dotenv').config();


const favorisController = {
  add_favoris: (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length > 3) return res.send({ message: 'too much parameters', success: false });
    const { id, product_id, shop_id } = req.body;
    if (!id || !product_id || !shop_id) return res.status(200).send({ message: 'missing parameters', success: false });

    Fav.findAll({ where: { [Op.and]: [{ user_id: id }, { shop_id: shop_id }, { product_id: product_id }] } })
      .then((product) => {
        if (Object.keys(product).length) {
          return res.status(200).send({ message: 'Product already in your favoris', success: false });
        } else {

          Fav.create({ user_id: id, product_id: product_id, shop_id: shop_id })
            .then((fav) => {
              if (fav) return res.status(200).send({ message: 'Product added to your favoris', success: true });
              else return res.status(200).send({ message: 'fail to add product in your favoris', success: false });
            })
            .catch((err) => {
              console.log('error on adding product to favoris: ', err);
              return res.status(200).send({ message: 'error on adding product to favoris', success: false });
            })
        }
      })
  },

  get_favoris: (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length > 1) return res.send({ message: 'too much parameters', success: false });
    const { id } = req.body;
    if (!id) return res.status(200).send({ message: 'missing parameters', success: false });

    Fav.findAll({ where: { user_id: id } })
      .then((fav) => {
        if (Object.keys(fav).length) {
          const data = [];

          fav.map((f) => {
            const { product_id, shop_id } = f.dataValues;
            data.push({ product_id, shop_id });
          });

          return res.status(200).send({ data, success: true });

        } else return res.status(200).send({ message: 'no favorites products find for this user', success: false });
      })
      .catch((err) => {
        console.log('error on finding favoris: ', err);
        return res.status(200).send({ message: 'error on finding favoris', success: false });
      })
  }
}

module.exports = favorisController;