const { comment } = require('postcss');
const { ProductComment } = require('../models/productComment.model');
require('dotenv').config();


const commentController = {
  add_comment: (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length > 5) return res.status(200).send({ message: 'too much parameters', success: false });
    const { product_id, username, shop_id, comment, id } = req.body;
    if (!username || !product_id || !shop_id || !comment || !id) {
      return res.status(200).send({ message: 'missing parameters', success: false });
    }

    ProductComment.create({ username, product_id, user_id: id, shop_id, comment })
      .then((comment) => {
        if (comment) return res.status(200).send({ message: 'Comment added successfully !', success: true });
        else return res.status(200).send({ message: 'fail to add comment', success: false });
      })
      .catch((err) => {
        console.log('error on create comment: ', err);
      })
  },

  get_all_comments: (req, res) => {
    if (Object.keys(req.body).length > 1) return res.send({ message: 'too much parameters', success: false });
    const { id } = req.params;
    if (!id) {
      return res.status(501).send({ message: 'missing parameters', success: false });
    }

    ProductComment.findAll({ where: { product_id: id } })
      .then((comments) => {
        if (Object.keys(comments).length) {
          const data = [];

          comments.map((c) => {
            const { username, comment, createdAt, user_id, id } = c;
            data.push({ username, comment, createdAt, user_id, id });
          })

          return res.status(200).send({ data, success: true });

        } else return res.status(200).send({ message: 'No comments for this product...', success: false });
      })
      .catch((err) => {
        console.log('error on finding comments: ', err);
        return res.status(200).send({ message: 'error on finding comments...', success: false });
      })
  },

  delete_comment: (req, res) => {
    console.log(req.body, req.params);
    if (Object.keys(req.body).length > 1) return res.send({ message: 'too much parameters', success: false });
    const { comment_id } = req.params;
    const { id } = req.body;
    if (!comment_id || !id) {
      return res.status(501).send({ message: 'missing parameters', success: false });
    }

    ProductComment.destroy({ where: { id: comment_id, user_id: id } })
      .then((comment) => {
        if (comment) {
          console.log('commment deleted');
          return res.status(200).send({ message: 'Comment deleted successfully !', success: true });
        } else {
          console.log('no comment to delete');
          return res.status(200).send({ message: 'no comment to delete', success: false });
        }
      })
      .catch((err) => {
        console.log('error on product delete');
        console.log((err));
        return res.status(200).send({ message: 'error on comment delete', success: false })
      })
  }
}

module.exports = commentController;