import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { products as assetProducts } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';

const Cart = () => {

  const { currency, cartItems, updateQuantity, navigate, token, getCartCount } = useContext(ShopContext);
  const authToken = token || localStorage.getItem('token') || '';

  const [cartData, setCartData] = useState([]);
  const normalizedProducts = assetProducts.map((product, index) => ({
    ...product,
    id: index + 1,
  }));

  useEffect(() => {

    const tempData = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            id: itemId,
            size,
            quantity: cartItems[itemId][size]
          })
        }
      }
    }
    setCartData(tempData);
  }, [cartItems])

  const handleCheckout = () => {
    if (getCartCount() === 0) {
      toast.error('Please add products to cart first')
      return
    }

    if (!authToken) {
      localStorage.setItem('redirectPath', '/cart')
      navigate('/login')
      return
    }

    navigate('/place-order')
  }

  return (
    <div className='border-t pt-14'>

      <div className=' text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.length === 0 && (
          <p className='text-sm text-gray-500 py-6'>Your cart is empty</p>
        )}
        {
          cartData.map((item) => {

            const numericId = Number(item.id);
            const productData = normalizedProducts.find((product) => product.id === numericId) || normalizedProducts.find((product) => product._id === item.id);

            if (!productData) {
              return null;
            }

            const productImage = Array.isArray(productData.image) ? productData.image[0] : productData.image;

            return (
              <div key={`${item.id}-${item.size}`} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className=' flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productImage} alt={productData.name} />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div>
                <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item.id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
                <img onClick={() => updateQuantity(item.id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="Remove item" />
              </div>
            )

          })
        }
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className=' w-full text-end'>
            <button onClick={handleCheckout} className='bg-black text-white text-sm my-8 px-8 py-3'>
              {authToken ? 'PROCEED TO CHECKOUT' : 'LOGIN FIRST'}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart
