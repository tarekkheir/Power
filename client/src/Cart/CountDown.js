import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../App/AppContext';
import './CountDown.css';

const CountdownTimer = ({ targetDate, product_id, shop_id, quantity, name }) => {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  const context = useContext(AppContext);
  const { user_id } = context;

  useEffect(() => {
    if (countDown > 0) {
      const interval = setInterval(() => {
        setCountDown(countDownDate - new Date().getTime());
      }, 1000);
      return () => clearInterval(interval);
    } else {
      axios.post('http://localhost:8080/delete_from_cart', { quantity, shop_id, product_id, user_id })
        .then((cart) => {
          if (cart.data.success) {
            alert(name + ': ' + cart.data.message);
          } else console.log(cart.data.message);
        })
        .catch((err) => {
          console.log('error on axios delete from cart: ', err);
        })
    }
  }, [countDownDate, countDown, quantity, shop_id, product_id, user_id, name]);


  return (
    <div className='count-down'>
      {minutes + seconds <= 0 ? (<span>Expired !!</span>) : (
        <p className='two-number'>
          {minutes <= 9 ? ('0' + minutes.toString()) : minutes} :&nbsp;
          {seconds <= 9 ? ('0' + seconds.toString()) : seconds}
        </p>
      )}
    </div>
  )
};

export { CountdownTimer };