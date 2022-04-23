import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const location = useLocation();
  const { name, price, quantity } = location.state;
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (count) setDisabled(false);
    else setDisabled(true)
  }, [count, setDisabled]);

  const plus = () => {
    if (count < quantity) {
      setCount(count + 1);
    }
  }

  const minus = () => {
    if (count) {
      setCount(count - 1);
    }
  }

  return (
    <div className='productpage'>
      <div className='product-image'>image</div>
      <div className='product-description'>
        <h1>{name} ( {quantity} )</h1>
        <h3>Description</h3>
        <p>Le lorem ipsum est, en imprimerie, une suite de mots sans
          signification utilisée à titre provisoire pour calibrer
          une mise en page, le texte définitif venant remplacer le
          faux-texte dès qu'il est prêt ou que la mise en page est achevée.
          Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum.</p>
        <h4>{price}</h4>
        <div className='count'>
          <button onClick={() => minus()}>-</button>
          <h4>{count}</h4>
          <button onClick={() => plus()}>+</button>
        </div>
        <button disabled={disabled} className='cart-button' onClick={() => setCount(0)}>Add to Cart</button>
      </div>
    </div >
  );
};

export default Product;
