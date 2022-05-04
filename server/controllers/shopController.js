const { Product } = require('../models/product.model');
const { Shop } = require('../models/shop.model');
const { Op } = require('sequelize');
const { Tunnel } = require('request/lib/tunnel');
require('dotenv').config();


const shopController = {
  add_shop: (req, res) => {
    if (Object.keys(req.body).length > 5) return res.send({ message: 'too much parameters' });
    const { name, boss_id, location, type, open_hours } = req.body;
    console.log(req.body);
    if (!name || !boss_id || !location || !type || !open_hours) {
      return res.status(200).send({ message: 'missing parameters' });
    }

    Shop.findAll({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (Object.keys(shop).length && boss_id !== 1) {
          console.log('Boss id already used !');
          return res.status(200).send({ message: 'You have already one shop registered !' });
        } else {
          Shop.findAll({ where: { name: name } })
            .then((shop) => {
              if (Object.keys(shop).length && boss_id !== 1) {
                console.log('Name already used !');
                return res.status(200).send({ message: 'Name already used !' });
              } else {
                Shop.create({
                  name: name,
                  location: location,
                  boss_id: boss_id,
                  type: type,
                  open_hours: open_hours
                })
                  .then((shop) => {
                    console.log('Shop added !');
                    return res.status(200).send({ message: 'Shop added successfully !', success: true });
                  })
                  .catch((err) => {
                    console.log('error on shop creation');
                  })
              }
            })
        }
      })
      .catch((err) => {
        console.log('error on finding boss_id');
        console.log(err);
        return res.status(501).send({ message: 'boss_id findAll error' });
      })
  },

  delete_shop: (req, res) => {
    if (Object.keys(req.body).length > 1) return res.status(501).send({ message: 'too much parameters' });
    const { boss_id } = req.body;
    if (!boss_id) {
      return res.status(200).send({ message: 'missing parameters' });
    }

    Shop.destroy({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (shop) {
          console.log('Shop deleted !', shop);
          return res.status(200).send({ message: 'Shop was successfully deleted !', success: true });
        } else {
          console.log('No shop to delete', shop);
          return res.status(200).send({ message: 'no shop to delete' });
        }
      })
      .catch((err) => {
        console.log('error on shop destroy');
        console.log(err);
        return res.status(200).send({ message: 'error on shop destroy' });
      });
  },

  update_shop_details: (req, res) => {
    if (Object.keys(req.body).length > 5) return res.send({ message: 'too much parameters' });
    const { name, boss_id, location, type, open_hours } = req.body;
    console.log(req.body);
    if (!name || !boss_id || !location || !type || !open_hours) {
      return res.status(501).send({ message: 'missing parameters' });
    }

    Shop.update({
      name: name,
      location: location,
      type: type,
      open_hours: open_hours
    }, { where: { boss_id: boss_id } })
      .then((shop) => {
        if (shop) {
          return res.status(200).send({ message: 'shop details updated successfully !', success: true });
        } else {
          return res.status(501).send({ message: 'no shop updates done' });
        }
      })
      .catch((err) => {
        console.log('error on shop details update');
        console.log(err);
        return res.status(501).send({ message: 'error on shop details update' });
      })
  },

  get_all_shop_details: (req, res) => {
    console.log('shop details called');
    Shop.findAll().then((shops) => {
      data = [];
      shops.map((shop) => {
        const { name, location, open_hours, type, id, boss_id } = shop.dataValues;
        data.push({
          name: name,
          location: location,
          open_hours: open_hours,
          type: type,
          id: id,
          boss_id: boss_id
        }
        );
      })
      return res.status(200).send(data);
    }).catch((err) => {
      console.log('error on finding shop');
      console.log(err);
      return res.status(501).send({ message: 'error on finding shop' });
    });
  },

  get_shop_by_id: (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    if (isNaN(id)) return res.status(200).send({ message: 'id is not a number' });

    Shop.findAll({ where: { id: id } })
      .then((shop) => {
        if (!Object.keys(shop).length) return res.status(200).send({ message: 'no shop for this id' });
        const shop_id = shop.map((s) => { return s.dataValues.id });
        if (!shop_id) { return res.status(200).send({ message: 'no shop find for this id' }) };

        const datas = [];

        Product.findAll({ where: { shop_id: shop_id } })
          .then((products) => {
            if (!Object.keys(products).length) return res.status(200).send({ message: 'no product available for this shop' });
            products.map((product) => {
              const { name, price, type, quantity, id, boss_id } = product.dataValues;
              datas.push({ name, price, type, quantity, id, boss_id });
            })
            return res.status(200).send(datas);
          })
          .catch((err) => {
            console.log('error on finding product', err);
            return res.status(200).send({ message: 'error on finding product' });
          })
      })
      .catch((err) => {
        console.log('error on finding shop', err);
        return res.status(200).send({ message: 'error on finiding shop' });
      })
  },

  get_shop_details: (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) return res.status(200).send({ message: 'id is not a number' });

    Shop.findAll({ where: { boss_id: id } })
      .then((shop) => {
        if (Object.keys(shop).length) {
          const { name, location, open_hours, type, id, boss_id } = shop[0].dataValues;
          return res.status(200).send({
            name: name,
            location: location,
            open_hours: open_hours,
            type: type,
            id: id,
            boss_id: boss_id
          });
        } else return res.status(200).send({ message: 'no shop find for this id' });
      }).catch((err) => {
        console.log('error on finding shop');
        console.log(err);
        return res.status(200).send({ message: 'error on finding shop' });
      });
  },
}

module.exports = shopController;
