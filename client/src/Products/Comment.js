import React, { useContext, useState } from 'react';
import profil from '../images/profil.png';
import heart from '../images/heart.png';
import red_heart from '../images/red_heart.png';
import AppContext from '../App/AppContext';
import axios from 'axios';

const Comment = ({ comment, createdAt, username, id, comment_id }) => {
  const [liked, setLiked] = useState(false);
  const context = useContext(AppContext);
  const { user: { user_id } } = context;

  const handleLike = (e) => {
    e.preventDefault();
    setLiked(!liked);
  }

  const deleteComment = (e) => {
    if (window.confirm('Are you sure to delete this comment ?')) {
      e.preventDefault();
      const accessToken = sessionStorage.getItem('accessToken');
      const headers = { 'authorization': accessToken };
      axios.post(`http://localhost:8080/delete_comment/${comment_id}`, {}, { headers: headers })
        .then((comment) => {
          if (comment.data.success) {
            alert(comment.data.message);
            window.location.reload();
          } else console.log(comment.data.message);
        })
        .catch((err) => {
          console.log('error on axios delete comment: ', err);
        })
    }
  }

  return (
    <li className='comment-list-item'>
      <div className='comment-header'>
        <img src={profil} alt='profil' width={50} height={50} />
        <div id='comment-header-user'>
          <h3>{username}</h3>
          <span id='hours-ago'>{createdAt}</span>
        </div>
        <div className='heart'>
          <img id='heart' src={liked ? red_heart : heart} alt='heart' width={30} height={30} onClick={(e) => handleLike(e)} />
        </div>
      </div>
      <div className='comment-body'>
        <p className='comment-body-text'>
          <span id='laquo'>&laquo;</span>
          <span id='comment-body-text'>{comment}</span>
          <span id='raquo'>&raquo;</span></p>
      </div>
      {Number(user_id) === id ?
        <div className='submit-delete-comment'>
          <button id='submit-delete-comment' onClick={(e) => deleteComment(e)} >Delete</button>
        </div> : null}
    </li>
  );
};

export default Comment;