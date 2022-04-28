import React, { useContext, useState } from 'react';
import './AddProduct.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from '../App/AppContext';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('salt');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [enableSubmit, setEnableSubmit] = useState(true);
    const navigate = useNavigate();
    const context = useContext(AppContext);
    const boss_id = context.id;


    const postProduct = (e) => {
        e.preventDefault();
        const accessToken = sessionStorage.getItem('accessToken');
        const headers = { 'authorization': accessToken };
        axios.post('http://localhost:8080/add_product', { name, type, price, boss_id, quantity }, { headers })
            .then((res) => {
                console.log(res.data);
                const { message } = res.data;
                alert(message);
                navigate('/myshop');
            })
            .catch((err) => {
                console.log('error on axios add shop post', err);
            })
    }


    const nameChange = (e) => {
        e.preventDefault();
        if (e.target.value && price && type) {
            setEnableSubmit(false);
        } else setEnableSubmit(true);

        setName(e.target.value);
    }

    const priceChange = (e) => {
        e.preventDefault();
        if (e.target.value && name && type) {
            setEnableSubmit(false);
        } else setEnableSubmit(true);

        setPrice(e.target.value);
    }

    const typeChange = (e) => {
        e.preventDefault();
        if (e.target.value && name && price) {
            setEnableSubmit(false);
        } else setEnableSubmit(true);

        setType(e.target.value);
    }

    const quantityChange = (e) => {
        e.preventDefault();
        if (e.target.value && name && price && type) {
            setEnableSubmit(false);
        } else setEnableSubmit(true);

        setQuantity(e.target.value);
    }

    return (
        <div className='addshop'>
            <h1>Add Product</h1>
            <form className='addshop-details' onSubmit={(e) => postProduct(e)}>
                <label>Product Name</label>
                <input value={name} type='text' onChange={(e) => nameChange(e)} />
                <label>Type of Product</label>
                <select value={type} onChange={(e) => typeChange(e)}>
                    <option value='salt'>Salt</option>
                    <option value='sweat'>Sweat</option>
                </select>
                <label>Price</label>
                <input type="number" min="0.00" max="10000.00" step="0.01" value={price} onChange={(e) => priceChange(e)} />
                <label>Quantity</label>
                <input type='number' min='0' max='999' value={quantity} onChange={(e) => quantityChange(e)} />
                <button disabled={enableSubmit} >Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;