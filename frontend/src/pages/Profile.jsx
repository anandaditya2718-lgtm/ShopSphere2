import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Profile = () => {
  const { backendUrl, navigate, token } = useContext(ShopContext)
  const authToken = token || localStorage.getItem('token') || ''

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authToken) {
      navigate('/login')
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await axios.get(backendUrl + '/api/user/profile', {
          headers: { token: authToken }
        })

        if (response.data.success) {
          setUser(response.data.user)
        } else {
          setError(response.data.message || 'Unable to load profile')
          toast.error(response.data.message || 'Unable to load profile')
        }
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Unable to load profile'
        setError(message)
        toast.error(message)

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token')
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [authToken, backendUrl, navigate])

  if (loading) {
    return (
      <div className='border-t min-h-[70vh] flex items-center justify-center py-16'>
        <div className='w-full max-w-lg rounded-3xl border border-gray-200 bg-white px-6 py-10 shadow-sm'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black' />
          <p className='mt-4 text-center text-sm text-gray-500'>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='border-t min-h-[70vh] flex items-center justify-center py-16'>
        <div className='w-full max-w-lg rounded-3xl border border-red-100 bg-red-50 px-6 py-10 text-center'>
          <p className='text-lg font-medium text-red-700'>Profile unavailable</p>
          <p className='mt-2 text-sm text-red-600'>{error}</p>
          <button
            onClick={() => navigate('/login')}
            className='mt-6 rounded-full bg-black px-6 py-2 text-sm font-medium text-white'
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const profileFields = [
    { label: 'Name', value: user?.name },
    { label: 'Email', value: user?.email },
    { label: 'Phone', value: user?.phone },
    { label: 'Address', value: user?.address },
  ]

  return (
    <div className='border-t min-h-[70vh] py-10 sm:py-16'>
      <div className='mx-auto flex w-full max-w-3xl justify-center'>
        <div className='relative w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]'>
          <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-black via-gray-700 to-gray-400' />
          <div className='p-6 sm:p-10'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <p className='text-sm uppercase tracking-[0.25em] text-gray-400'>Account</p>
                <h1 className='prata-regular mt-2 text-3xl sm:text-4xl text-gray-900'>My Profile</h1>
              </div>
              <p className='text-sm text-gray-500'>Your personal details from the logged-in account.</p>
            </div>

            <div className='mt-8 grid gap-4 sm:grid-cols-2'>
              {profileFields.map((field) => (
                <div key={field.label} className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4'>
                  <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-400'>{field.label}</p>
                  <p className='mt-2 break-words text-sm sm:text-base text-gray-800'>
                    {field.value || 'Not provided'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile