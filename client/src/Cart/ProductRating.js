import React, { forwardRef, useState, useImperativeHandle } from 'react';

const ProductRating = forwardRef((props, _ref) => {
  const { name, fileName, product_id } = props;
  const url = 'http://localhost:8080/products_images/';
  const stars = [1, 2, 3, 4, 5];
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const selectedIcon = "★";
  const deselectedIcon = "☆";


  const changeRating = (newRating) => {
    setRating(newRating);
  }

  const hoverRating = (rating) => {
    setHovered(rating);
  }

  useImperativeHandle(_ref, () => ({
    getChildRating: () => {
      return rating;
    },
    getName: () => {
      return name;
    },
    getProductId: () => {
      return product_id;
    }
  }))

  return (
    <div className='rating-item'>
      <h3 className='cart-product-name'>
        <img className='rating-product-image' src={url + fileName} alt='product' />
        <span className='margin-center'>{name}</span>
      </h3>
      <div className="rating margin-center" style={{ fontSize: '3.5rem', color: "#38d39f" }}>
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
    </div>
  );
});

export default ProductRating;