import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppContext from '../App/AppContext';
import './ProductPage.css';
import Comment from './Comment';


const Product = () => {
  const context = useContext(AppContext);
  const { user: { user_id, username } } = context;
  const location = useLocation();
  const { product_id } = location.state;
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [product, setProduct] = useState({ name: '', price: 0, quantity: 0, shop_id: 0 })
  const [comment, setComment] = useState('How did you find this product ? ...');
  const [allComments, setAllComments] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (count) setDisabled(false);
    else setDisabled(true)

    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };

    axios.get(`http://localhost:8080/product/${product_id}`, { headers: headers })
      .then((product) => {
        if (product.data.success) {
          const { name, price, quantity, shop_id } = product.data;
          setProduct({ name: name, price: price, quantity: quantity, shop_id: shop_id });
        } else alert(product.data.message);
      })
      .catch((err) => {
        console.log('error on axios get product: ', err);
      })

    axios.get(`http://localhost:8080/get_all_comments/${product_id}`, { headers: headers })
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

  }, [product_id, count, setDisabled]);


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
      product_id: product_id,
      shop_id: product.shop_id,
      user_id: user_id,
      expire_date: targetDate,
      price: product.price
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
          product_id: product_id,
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
        <div className='product-image'>image</div>
        <div className='product-description'>
          <h1>{product.name} ({product.quantity})</h1>
          <h3>Description</h3>
          <p>Le lorem ipsum est, en imprimerie, une suite de mots sans
            signification utilisée à titre provisoire pour calibrer
            une mise en page, le texte définitif venant remplacer le
            faux-texte dès qu'il est prêt ou que la mise en page est achevée.
            Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum.</p>
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
        <textarea name='comment' id='comment-area' value={comment} onChange={(e) => handleCommentChange(e)} />
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
