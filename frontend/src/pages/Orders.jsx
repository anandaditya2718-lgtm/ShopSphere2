import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Orders = () => {

  const { currency, backendUrl, token } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);

  const fetchOrders = async () => {
    if (!token) {
      setOrders([]);
      return;
    }

    try {
      const response = await axios.get(backendUrl + '/api/orders/user', { headers: { token } });
      if (response.data.success) {
        const latestOrders = (response.data.orders || []).slice().reverse();
        setOrders(latestOrders);
        setUnauthorized(false);
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
        if ((response.data.message || '').toLowerCase().includes('not authorized')) {
          setUnauthorized(true);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        setUnauthorized(true);
      }
    }
  };

  useEffect(() => {
    if (token) {
      setUnauthorized(false);
    }
    fetchOrders();

    // Keep order status fresh when admin updates status.
    const intervalId = setInterval(fetchOrders, 15000);
    return () => clearInterval(intervalId);
  }, [token, backendUrl]);

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        {unauthorized && (
          <div className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3'>
            <p className='text-sm text-red-700'>Not authorized. Please login first.</p>
            <button
              onClick={() => navigate('/login')}
              className='mt-3 rounded-md bg-black px-4 py-2 text-sm text-white'
            >
              Login First
            </button>
          </div>
        )}

        <div>
            {orders.length === 0 && (
              <p className='text-sm text-gray-500 py-6'>No orders yet</p>
            )}
            {
              orders.map((order) => (
                <div key={order._id} className='py-4 border-t border-b text-gray-700 flex flex-col gap-4'>
                    {order.items.map((item, index) => {
                      const productImage = Array.isArray(item.image) ? item.image[0] : item.image;
                      return (
                        <div key={`${order._id}-${index}`} className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                          <div className='flex items-start gap-6 text-sm'>
                              <img className='w-16 sm:w-20' src={productImage} alt={item.name} />
                              <div>
                                <p className='sm:text-base font-medium'>{item.name}</p>
                                <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                                  <p>{currency}{item.price}</p>
                                  <p>Quantity: {item.quantity}</p>
                                  <p>Size: {item.size}</p>
                                </div>
                              </div>
                          </div>
                        </div>
                      )
                    })}
                    <div className='md:w-1/2 flex justify-between'>
                        <div>
                          <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(order.date).toDateString()}</span></p>
                          <p className='mt-1'>Order ID: <span className=' text-gray-400'>{order._id}</span></p>
                          <p className='mt-1'>Total: <span className=' text-gray-400'>{currency}{order.amount}</span></p>
                          <p className='mt-1'>Payment: <span className=' text-gray-400'>{order.paymentMethod}</span></p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                            <p className='text-sm md:text-base'>{order.status}</p>
                        </div>
                    </div>
                </div>
              ))
            }
        </div>
    </div>
  )
}

export default Orders
