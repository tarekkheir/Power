const { Historic } = require('../models/historic.model');
require('dotenv').config();


const historicController = {
  get_historic: (req, res) => {
    if (Object.keys(req.body).length > 1) return res.send({ message: 'too much parameters', success: false });
    const { id } = req.body;
    if (!id) return res.status(200).send({ message: 'missing parameters', success: false })

    Historic.findAll({ where: { user_id: id } })
      .then((historic) => {
        if (Object.keys(historic).length) {

          const data = [];
          historic.map((h) => {
            const { products, createdAt, total } = h.dataValues;
            data.push({ products, createdAt, total });
            return 1;
          })
          return res.status(200).send({ data, success: true });
        } else return res.status(200).send({ message: 'No history found for this user_id...', succes: false });
      })
      .catch((err) => {
        console.log('error on finding historic: ', err);
        return res.status(200).send({ message: 'error on finding historic', succes: false });
      })
  }
}

module.exports = historicController;