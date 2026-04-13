import React from 'react'
import { products } from '../assets/assets'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const bestSellers = products
      .slice(0, 10)
      .map((product, index) => ({
        ...product,
        id: product.id || index + 1,
      }));

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Top picks everyone is loving right now.
        </p>
      </div>

      {bestSellers.length === 0 && (
        <p className='text-center text-sm text-gray-500'>No products available.</p>
      )}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
            bestSellers.map((product)=>(
                <ProductItem key={product.id} id={product.id} name={product.name} image={product.image} price={product.price} />
            ))
        }
      </div>
    </div>
  )
}

export default BestSeller
