import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { products as assetProducts } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

    const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, addOrder } = useContext(ShopContext);
    const navigate = useNavigate();
    const [unauthorized, setUnauthorized] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
    })

    useEffect(() => {
        console.log('unauthorized state:', unauthorized)
    }, [unauthorized])

    useEffect(() => {
        if (token) {
            setUnauthorized(false)
        }
    }, [token])

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                return
            }

            try {
                const response = await axios.get(backendUrl + '/api/user/profile', {
                    headers: { token }
                })

                if (response.data.success) {
                    const user = response.data.user || {}
                    setFormData((prev) => ({
                        ...prev,
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        street: typeof user.address === 'string' ? user.address : '',
                        city: '',
                        state: '',
                        zipcode: '',
                        country: '',
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchUserProfile()
    }, [token, backendUrl])

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {

            let orderItems = []
            const normalizedProducts = assetProducts.map((product, index) => ({
                ...product,
                id: product.id || index + 1,
            }));

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(
                            normalizedProducts.find((product) => product.id === Number(items)) ||
                            normalizedProducts.find((product) => product._id === items)
                        )
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            const [firstName = '', ...lastNameParts] = (formData.name || '').trim().split(' ')
            const lastName = lastNameParts.join(' ')

            let orderData = {
                address: {
                    ...formData,
                    firstName,
                    lastName,
                },
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
            if (response.data.success) {
                setUnauthorized(false)
                addOrder({
                    id: Date.now(),
                    items: orderItems,
                    total: Number(orderData.amount),
                    date: Date.now(),
                    status: 'Order Placed',
                    paymentMethod: 'COD',
                })
                setCartItems({})
                navigate('/orders')
            } else {
                toast.error(response.data.message)
                if ((response.data.message || '').toLowerCase().includes('not authorized')) {
                    setUnauthorized(true)
                }
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)
            if (!token || error.response?.status === 401) {
                setUnauthorized(true)
            }
        }
    }


    return (
        <div className='border-t pt-5 sm:pt-14 min-h-[80vh]'>
            {unauthorized && (
                <div className='mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3'>
                    <p className='text-sm text-red-700'>Not authorized. Please login first.</p>
                    <button
                        type='button'
                        onClick={() => navigate('/login')}
                        className='mt-3 rounded-md bg-black px-4 py-2 text-sm text-white'
                    >
                        Login First
                    </button>
                </div>
            )}

        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4'>
            {/* ------------- Left Side ---------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <input required onChange={onChangeHandler} name='name' value={formData.name} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Full Name' />
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Phone' />
            </div>

            {/* ------------- Right Side ------------------ */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    {/* --------------- Payment Method Selection ------------- */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div className='flex items-center gap-3 border p-2 px-3'>
                            <p className='min-w-3.5 h-3.5 border rounded-full bg-green-400'></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
        </div>
    )
}

export default PlaceOrder
