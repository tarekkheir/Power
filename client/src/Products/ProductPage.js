import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../App/AppContext';
import './ProductPage.css';
import Comment from './Comment';


const Product = () => {
  const context = useContext(AppContext);
  const { user: { user_id, username } } = context;
  const params = useParams();
  const { id } = params;
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [product, setProduct] = useState({ name: '', price: 0, quantity: 0, shop_id: 0 })
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const navigate = useNavigate();
  const url = 'http://localhost:8080/products_images/'


  useEffect(() => {
    if (count) setDisabled(false);
    else setDisabled(true)

    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };

    axios.get(`http://localhost:8080/product/${id}`, { headers: headers })
      .then((product) => {
        if (product.data.success) {
          const { name, price, quantity, shop_id, description, fileName } = product.data;
          setProduct({ name, price, quantity, shop_id, fileName, description });
        } else alert(product.data.message);
      })
      .catch((err) => {
        console.log('error on axios get product: ', err);
      })

    axios.get(`http://localhost:8080/get_all_comments/${id}`, { headers: headers })
      .then((comments) => {
        if (comments.data.success) {
          const data = [];

          comments.data.data.map((c) => {
            const { username, comment, createdAt, user_id, id } = c;
            data.push({ username, comment, createdAt, user_id, id });
            return 1;
          })

          setAllComments(data);
        }
      })
      .catch((err) => {
        console.log('error on axios get comments: ', err);
      })

  }, [id, count, setDisabled]);


  console.log('allComments', allComments);

  const addCart = (e) => {
    e.preventDefault();
    const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;
    const NOW_IN_MS = new Date().getTime();
    const targetDate = NOW_IN_MS + THIRTY_MINUTES_IN_MS;
    console.log('user_id: ', user_id);

    axios.post('http://localhost:8080/add_to_cart', {
      name: product.name,
      quantity: count,
      product_id: id,
      shop_id: product.shop_id,
      user_id: user_id,
      expire_date: targetDate,
      price: product.price,
      fileName: product.fileName
    })
      .then((cart) => {
        if (cart.data.success) {
          alert(cart.data.message);
          navigate(`/profil/cart`);
        } else alert(cart.data.message);
      })
      .catch((err) => {
        console.log('error on adding product to the cart: ', err);
      })
    setCount(0);
  }

  const plus = () => {
    if (count < product.quantity) {
      setCount(count + 1);
    }
  }

  const minus = () => {
    if (count) {
      setCount(count - 1);
    }
  }

  const leaveComment = (e) => {
    if (window.confirm('Leave this comment ?')) {
      e.preventDefault();
      const accessToken = sessionStorage.getItem('accessToken');
      const headers = { 'authorization': accessToken };

      axios.post('http://localhost:8080/add_comment',
        {
          username: username,
          product_id: id,
          shop_id: product.shop_id,
          comment: comment
        }, { headers: headers })
        .then((comment) => {
          if (comment.data.success) {
            alert(comment.data.message);
            window.location.reload();
          } else console.log(comment.data.message);
        })
        .catch((err) => {
          console.log('error on axios post comment: ', err);
        })
    }
  }

  const handleCommentChange = (e) => {
    e.preventDefault();
    setComment(e.target.value);
  }


  return (
    <div className='product-page-container'>
      <div className='productpage'>
        <div className='product-image-container'>
          <img className='product-image' src={url + product.fileName} alt='product' />
        </div>
        <div className='product-description'>
          <h1>{product.name} ({product.quantity})</h1>
          <h3>Description</h3>
          <p>{product.description}</p>
          <h4>{product.price} €</h4>
          <div className='count'>
            <button onClick={() => minus()}>-</button>
            <h4>{count}</h4>
            <button onClick={() => plus()}>+</button>
          </div>
          <button disabled={disabled} className='cart-button' onClick={(e) => addCart(e)}>
            <span>{count * product.price} €</span>
          </button>
        </div>
      </div >
      <form className='shop-comments' onSubmit={(e) => leaveComment(e)}>
        <label id='leave-comment'>Leave a comment</label>
        <textarea
          placeholder='How did you find this product ? ...'
          name='comment'
          id='comment-area'
          value={comment}
          onChange={(e) => handleCommentChange(e)} />

        <div id='comment-button-container'>
          <button id='submit-comment-button' type='submit'>Submit</button>
        </div>
      </form>
      <ul className='comment-list'>
        {allComments.length > 0 ? allComments.map((c) => {
          const { comment, username, createdAt, user_id, id } = c;
          return <Comment comment={comment} username={username} createdAt={createdAt} id={user_id} comment_id={id} />
        }) : null}
      </ul>
    </div>
  );
};

export default Product;
