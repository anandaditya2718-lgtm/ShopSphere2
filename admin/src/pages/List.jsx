import React, { useEffect, useState } from 'react'
import { currency } from '../App'
import { products } from '../assets/assets'

const List = () => {

  const [productList, setProductList] = useState([])

  useEffect(() => {
    const normalizedProducts = products.map((product, index) => ({
      ...product,
      id: product.id || product._id || String(index)
    }))
    setProductList(normalizedProducts)
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        <div className='hidden md:grid grid-cols-[0.7fr_3fr_1.5fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
        </div>

        {
          productList.map((product) => (
            <div
              className='grid grid-cols-[0.7fr_3fr_1.5fr] md:grid-cols-[0.7fr_3fr_1.5fr_1fr] items-center gap-2 py-2 px-3 border text-sm bg-white'
              key={product.id}
            >
              <img
                className='w-12 h-12 object-cover rounded'
                src={Array.isArray(product.image) ? product.image[0] : product.image}
                alt={product.name}
              />
              <p className='font-medium text-gray-800'>{product.name}</p>
              <p className='text-gray-600'>{product.category}</p>
              <p className='hidden md:block text-gray-700'>{currency}{product.price}</p>
              <div className='md:hidden text-gray-700'>{currency}{product.price}</div>
            </div>
          ))
        }

        {productList.length === 0 && (
          <p className='text-sm text-gray-500 py-4'>No products found.</p>
        )}

      </div>
    </>
  )
}

export default List