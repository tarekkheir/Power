import { useEffect, useState } from 'react';
import './CountDown.css';

const CountdownTimer = ({ targetDate }) => {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  useEffect(() => {
    if (countDown > 0) {
      const interval = setInterval(() => {
        setCountDown(countDownDate - new Date().getTime());
      }, 1000);
      return () => clearInterval(interval);
    } else {
      console.log('call delete from cart');
    }
  }, [countDownDate, countDown]);


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