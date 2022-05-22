import React, { useState } from 'react';
import './StarRatingPage.css';
import axios from 'axios';


const StarRatingPage = () => {
  const stars = [1, 2, 3, 4, 5];
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const selectedIcon = "★";
  const deselectedIcon = "☆";

  const changeRating = (newRating) => {
    setRating(newRating);
  }

  const hoverRating = (rating) => {
    setHovered(rating);
  }

  const leaveComment = (e) => {
    if (window.confirm('Leave this comment ?')) {
      e.preventDefault();
      // const accessToken = sessionStorage.getItem('accessToken');
      // const headers = { 'authorization': accessToken };

      // axios.post('http://localhost:8080/add_comment',
      //   {
      //     username: username,
      //     product_id: id,
      //     shop_id: product.shop_id,
      //     comment: comment
      //   }, { headers: headers })
      //   .then((comment) => {
      //     if (comment.data.success) {
      //       alert(comment.data.message);
      //       window.location.reload();
      //     } else console.log(comment.data.message);
      //   })
      //   .catch((err) => {
      //     console.log('error on axios post comment: ', err);
      //   })
    }
  }

  const handleCommentChange = (e) => {
    e.preventDefault();
    setComment(e.target.value);
  }


  return (
    <div className='star-rating-page'>
      <div className="rating" style={{ fontSize: '5em', color: "#38d39f" }}>

        {stars.map(star => {
          return (
            <span
              id='star_icon'
              onClick={() => changeRating(star)}
              onMouseEnter={() => hoverRating(star)}
              onMouseLeave={() => hoverRating(0)}
            >
              {rating < star ?
                hovered < star ? deselectedIcon : selectedIcon
                :
                selectedIcon
              }
            </span>
          );
        })}

      </div>
      <div>
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
      </div>
    </div>
  );
};


export default StarRatingPage;