const { Product } = require('../models/product.model');
const { Shop } = require('../models/shop.model');
const { Op } = require('sequelize');
require('dotenv').config();


const shopController = {
  add_shop: (req, res) => {
    if (Object.keys(req.body).length > 5) return res.send({ message: 'too much parameters' });
    const { name, boss_id, location, type, open_hours } = req.body;
    console.log(req.body);
    if (!name || !boss_id || !location || !type || !open_hours) {
      return res.status(501).send({ 'error': 'missing parameters' });
    }

    Shop.findAll({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (Object.keys(shop).length) {
          console.log('Boss id already used !');
          return res.status(501).send({ 'error': 'You have already one shop registered !' });
        } else {
          Shop.findAll({ where: { name: name } })
            .then((shop) => {
              if (Object.keys(shop).length) {
                console.log('Name already used !');
                return res.status(501).send({ 'error': 'Name already used !' });
              } else {
                Shop.findAll({ where: { location: location } })
                  .then((shop) => {
                    if (Object.keys(shop).length) {
                      return res.status(501).send({ 'error': 'location already used !' });
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
                          return res.status(200).send({ 'OK': 'Shop added successfully !' });
                        })
                        .catch((err) => {
                          console.log('error on shop creation');
                        })
                    }
                  })
              }
            })
        }
      })
      .catch((err) => {
        console.log('error on finding boss_id');
        console.log(err);
        return res.status(501).send({ 'error': 'boss_id findAll error' });
      })
  },

  delete_shop: (req, res) => {
    if (Object.keys(req.body).length > 1) return res.status(501).send({ message: 'too much parameters' });
    const { boss_id } = req.body;
    if (!boss_id) {
      return res.status(501).send({ 'error': 'missing parameters' });
    }

    Shop.destroy({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (shop) {
          console.log('Shop deleted !', shop);
          return res.status(200).send({ 'OK': 'Shop was successfully deleted !' });
        } else {
          console.log('No shop to delete', shop);
          return res.status(501).send({ 'error': 'no shop to delete' });
        }
      })
      .catch((err) => {
        console.log('error on shop destroy');
        console.log(err);
        return res.status(501).send({ 'error': 'error on shop destroy' });
      });
  },

  update_shop_details: (req, res) => {
    if (Object.keys(req.body).length > 5) return res.send({ message: 'too much parameters' });
    const { name, boss_id, location, type, open_hours } = req.body;
    console.log(req.body);
    if (!name || !boss_id || !location || !type || !open_hours) {
      return res.status(501).send({ 'error': 'missing parameters' });
    }

    Shop.update({
      name: name,
      location: location,
      type: type,
      open_hours: open_hours
    }, { where: { [Op.and]: [{ name: name }, { boss_id: boss_id }] } })
      .then((shop) => {
        if (shop) {
          return res.status(200).send({ 'OK': 'shop details updated successfully !' });
        } else {
          return res.status(501).send({ 'error': 'no shop updates done' });
        }
      })
      .catch((err) => {
        console.log('error on shop details update');
        console.log(err);
        return res.status(501).send({ 'error': 'error on shop details update' });
      })
  },

  get_all_shop_details: (req, res) => {
    Shop.findAll().then((shops) => {
      data = [];
      shops.map((shop) => {
        const { name, location, open_hours, type, id } = shop.dataValues;
        data.push({
          name: name,
          location: location,
          open_hours: open_hours,
          type: type,
          id: id
        }
        );
      })
      return res.status(200).send(data);
    }).catch((err) => {
      console.log('error on finding shop');
      console.log(err);
      return res.status(501).send({ 'error': 'error on finding shop' });
    });
  },

  get_shop_by_id: (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) return res.status(501).send({ 'error': 'id is not a number' });

    Shop.findAll({ where: { id: id } })
      .then((shop) => {
        if (!Object.keys(shop).length) return res.status(501).send({ 'error': 'no shop for this id' });
        const shop_id = shop.map((s) => { return s.dataValues.id });
        if (!shop_id) { return res.status(501).send({ 'error': 'no shop find for this id' }) };

        const datas = [];

        Product.findAll({ where: { shop_id: shop_id } })
          .then((products) => {
            if (!Object.keys(products).length) return res.status(200).send({ 'OK': 'no product available for this shop' });
            products.map((product) => {
              const { name, price, type, quantity, id } = product.dataValues;
              datas.push({ name, price, type, quantity, id });
            })
            return res.status(200).send(datas);
          })
          .catch((err) => {
            console.log('error on finding product', err);
            return res.status(501).send({ 'error': 'error on finding product' });
          })
      })
      .catch((err) => {
        console.log('error on finding shop', err);
        return res.status(501).send({ 'error': 'error on finiding shop' });
      })
  }
}

module.exports = shopController;
