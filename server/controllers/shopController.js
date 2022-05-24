const { Product } = require('../models/product.model');
const { Shop } = require('../models/shop.model');
const { ProductComment } = require('../models/productComment.model');
const { Op } = require('sequelize');
const fs = require('fs');
require('dotenv').config();


const shopController = {
  add_shop: (req, res) => {
    console.log(req.file);
    console.log(req.headers);
    console.log(req.body);
    if (Object.keys(req.body).length > 5) return res.send({ message: 'too much parameters' });
    const { name, boss_id, location, type, open_hours } = req.body;
    console.log(req.body);
    if (!name || !boss_id || !location || !type || !open_hours) {
      return res.status(200).send({ message: 'missing parameters' });
    }

    Shop.findAll({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (Object.keys(shop).length) {
          console.log('Boss id already used !');
          return res.status(200).send({ message: 'You have already one shop registered !' });
        } else {
          Shop.findAll({ where: { name: name } })
            .then((shop) => {
              if (Object.keys(shop).length) {
                console.log('Name already used !');
                return res.status(200).send({ message: 'Name already used !' });
              } else {
                Shop.create({
                  name: name,
                  location: location,
                  boss_id: boss_id,
                  type: type,
                  open_hours: open_hours,
                  fileName: req.file.originalname
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
    if (Object.keys(req.body).length > 4) return res.status(501).send({ message: 'too much parameters', success: false });
    const { boss_id, shop_id, products, fileName } = req.body;
    if (!boss_id || !shop_id || !products || !fileName) {
      return res.status(200).send({ message: 'missing parameters', success: false });
    }

    Shop.destroy({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (shop) {
          console.log('Shop deleted !', shop);

          Product.destroy({ where: { boss_id: boss_id } })
            .then((product) => {
              if (product) {
                console.log('Products deleted: ', product);

                ProductComment.destroy({ where: { shop_id: shop_id } })
                  .then((comment) => {
                    if (comment) {
                      console.log('Comments deleted: ', comment);

                      const shop_image = process.env.DIR_SHOPS + fileName;

                      fs.unlink(shop_image, (err) => {
                        if (err) {
                          console.log('error on remove shop image: ', err);
                          return res.status(200).send({ message: 'error on remove shop image...', success: false });;
                        } else console.log('shop image deleted ! : ', shop_image);
                      });

                      products.map((p) => {
                        const { fileName } = p;
                        const product_image = process.env.DIR_PRODUCTS + fileName;

                        fs.unlink(product_image, (err) => {
                          if (err) {
                            console.log('error on remove product image: ', err);
                            return res.status(200).send({ message: 'error on remove product image...', success: false });
                          } else console.log('product image deleted ! : ', product_image);
                        })
                      })

                      return res.status(200).send({ message: 'Shop was successfully deleted !', success: true });

                    } else return res.status(200).send({ message: 'no product comment deleted', success: false });
                  })
                  .catch((err) => {
                    console.log('error on delete product comment: ', err);
                    return res.status(200).send({ message: 'error on delete product comment', success: false });
                  })

              } else {
                console.log('No products deleted', shop);
                return res.status(200).send({ message: 'no products deleted', success: false });
              }
            })
            .catch((err) => {
              console.log('error on product destroy: ', err);
              return res.status(200).send({ message: 'error on product destroy', success: false });
            })

        } else {
          console.log('No shop to delete', shop);
          return res.status(200).send({ message: 'no shop to delete', success: false });
        }
      })
      .catch((err) => {
        console.log('error on shop destroy');
        console.log(err);
        return res.status(200).send({ message: 'error on shop destroy', success: false });
      });
  },

  update_shop_details: (req, res) => {
    console.log('req body: ', req.body);
    console.log('req file: ', req.file);
    if (Object.keys(req.body).length > 6) return res.send({ message: 'too much parameters', success: false });
    const { name, boss_id, location, type, open_hours } = req.body;
    if (!name || !boss_id || !location || !type || !open_hours) {
      return res.status(200).send({ message: 'missing parameters', success: false });
    }

    Shop.findAll({ where: { boss_id: boss_id } })
      .then((shop) => {
        if (Object.keys(shop).length > 0) {
          const { fileName } = shop[0].dataValues;

          if (req.file) {
            const shop_image = process.env.DIR_SHOPS + fileName;

            fs.unlink(shop_image, (err) => {
              if (err) {
                console.log('error on delete image: ', err)
              } else console.log('shop image deleted');
            });
          }

          const fileName_update = req.file ? req.file.originalname : fileName;

          Shop.update({
            name: name,
            location: location,
            type: type,
            open_hours: open_hours,
            fileName: fileName_update
          }, { where: { boss_id: boss_id } })
            .then((shop) => {
              if (shop) {
                return res.status(200).send({ message: 'shop details updated successfully !', success: true });
              } else {
                return res.status(501).send({ message: 'no shop updates done', success: false });
              }
            })
            .catch((err) => {
              console.log('error on shop details update');
              console.log(err);
              return res.status(501).send({ message: 'error on shop details update', success: false });
            })
        }
      })

  },

  get_all_shop_details: (req, res) => {
    console.log('shop details called');
    Shop.findAll().then((shops) => {
      data = [];
      shops.map((shop) => {
        const { name, location, open_hours, type, id, boss_id, fileName } = shop.dataValues;
        data.push({
          name: name,
          location: location,
          open_hours: open_hours,
          type: type,
          id: id,
          boss_id: boss_id,
          fileName: fileName
        }
        );
      })
      return res.status(200).send({ data, success: true });
    }).catch((err) => {
      console.log('error on finding shop');
      console.log(err);
      return res.status(501).send({ message: 'error on finding shop', success: true });
    });
  },

  get_shop_by_id: (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    if (isNaN(id)) return res.status(200).send({ message: 'id is not a number', success: false });

    Shop.findAll({ where: { id: id } })
      .then((shop) => {
        if (!Object.keys(shop).length) return res.status(200).send({ message: 'no shop for this id', success: false });
        const shop_id = shop.map((s) => { return s.dataValues.id });
        if (!shop_id) { return res.status(200).send({ message: 'no shop find for this id', success: false }) };

        const datas = [];

        Product.findAll({ where: { shop_id: shop_id } })
          .then((products) => {
            if (!Object.keys(products).length) return res.status(200).send({ message: 'no product available for this shop', success: false });
            products.map((product) => {
              const { name, price, type, quantity, id, boss_id, fileName, reviews, star_rating } = product.dataValues;
              datas.push({ name, price, type, quantity, id, boss_id, fileName, reviews, star_rating });
            })
            return res.status(200).send({ datas, success: true });
          })
          .catch((err) => {
            console.log('error on finding product', err);
            return res.status(200).send({ message: 'error on finding product', success: false });
          })
      })
      .catch((err) => {
        console.log('error on finding shop', err);
        return res.status(200).send({ message: 'error on finiding shop', success: false });
      })
  },

  get_shop_details: (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) return res.status(200).send({ message: 'id is not a number', success: false });

    Shop.findAll({ where: { boss_id: id } })
      .then((shop) => {
        if (Object.keys(shop).length) {
          const { name, location, open_hours, type, id, boss_id, fileName } = shop[0].dataValues;
          return res.status(200).send({
            name: name,
            location: location,
            open_hours: open_hours,
            type: type,
            id: id,
            boss_id: boss_id,
            fileName: fileName,
            success: true
          });
        } else return res.status(200).send({ message: 'no shop find for this id', success: false });
      }).catch((err) => {
        console.log('error on finding shop');
        console.log(err);
        return res.status(200).send({ message: 'error on finding shop', success: false });
      });
  },
}

module.exports = shopController;
