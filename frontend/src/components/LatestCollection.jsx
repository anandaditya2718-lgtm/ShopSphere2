import React from 'react'
import { products as assetProducts } from '../assets/assets'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const latestProducts = assetProducts
      .map((product, index) => ({
        ...product,
        id: index + 1,
      }))
      .slice(0, 25)
      ;

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
          <Title text1={'LATEST'} text2={'COLLECTIONS'} />
          <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
         Fresh styles, just dropped — upgrade your wardrobe now.
          </p>
      </div>

      {/* Rendering Products */}
      {latestProducts.length === 0 && (
        <p className='text-center text-sm text-gray-500'>No products available.</p>
      )}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          latestProducts.map((product)=>(
            <ProductItem key={product.id} id={product.id} image={product.image} name={product.name} price={product.price} />
          ))
        }
      </div>
    </div>
  )
}

export default LatestCollection
