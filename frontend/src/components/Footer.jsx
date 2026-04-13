import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <h1 class="text-3xl font-bold tracking-wide text-gray-800">
  ShopSphere<span class="text-pink-500">.</span>
</h1>
            <p class="text-gray-600 mt-3">
  At ShopSphere, we redefine fashion with a curated collection of modern, stylish, and comfortable apparel. 
  From everyday essentials to statement pieces, we ensure quality, affordability, and a seamless shopping experience.
</p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+1-219-695-7896</li>
                <li>contact@ShopSphere.com</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2026@ ShopSphere.com - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
