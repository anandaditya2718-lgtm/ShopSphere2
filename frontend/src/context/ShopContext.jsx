import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { products as assetProducts } from '../assets/assets'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '')
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [productsError, setProductsError] = useState('');
    const [orders, setOrders] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('orders')) || [];
        } catch (error) {
            return [];
        }
    });
    const [token, setToken] = useState('')
    const navigate = useNavigate();

    const getStoredCart = () => {
        try {
            return JSON.parse(localStorage.getItem('cart')) || {}
        } catch (error) {
            return {}
        }
    }

    const mergeCartItems = (baseCart = {}, incomingCart = {}) => {
        const mergedCart = structuredClone(baseCart || {})

        for (const itemId in incomingCart || {}) {
            if (!mergedCart[itemId]) {
                mergedCart[itemId] = {}
            }

            for (const size in incomingCart[itemId]) {
                const existingQuantity = Number(mergedCart[itemId][size]) || 0
                const incomingQuantity = Number(incomingCart[itemId][size]) || 0
                mergedCart[itemId][size] = existingQuantity + incomingQuantity
            }
        }

        return mergedCart
    }

    const addOrder = (newOrder) => {
        setOrders((prevOrders) => {
            const updatedOrders = [...prevOrders, newOrder];
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            return updatedOrders;
        });
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems])


    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        const normalizedProducts = assetProducts.map((product, index) => ({
            ...product,
            id: product.id || index + 1,
            price: Number(product.price) || 0,
        }));

        const cartLineItems = Object.entries(cartItems).flatMap(([id, sizeMap]) =>
            Object.values(sizeMap || {}).map((quantity) => ({
                id,
                quantity: Number(quantity) || 0,
            }))
        );

        const subtotal = cartLineItems.reduce((total, item) => {
            if (item.quantity <= 0) {
                return total;
            }

            const product = normalizedProducts.find((p) => p.id === Number(item.id)) || normalizedProducts.find((p) => p._id === item.id);
            if (!product) {
                return total;
            }

            return total + product.price * item.quantity;
        }, 0);

        return subtotal;
    }

    const getProductsData = async () => {
        setIsLoadingProducts(true)
        setProductsError('')
        try {

            const apiUrl = backendUrl + '/api/product/list'
            console.log('[products] fetching from:', apiUrl)
            const response = await axios.get(apiUrl)
            console.log('[products] response:', response.data)
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                setProducts([])
                setProductsError(response.data.message || 'Unable to fetch products')
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            setProducts([])
            setProductsError(error.message || 'Unable to fetch products')
            toast.error(error.message)
        } finally {
            setIsLoadingProducts(false)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                const backendCart = response.data.cartData || {}
                const localCart = getStoredCart()

                if (Object.keys(localCart).length > 0) {
                    setCartItems(mergeCartItems(backendCart, localCart))
                    return
                }

                setCartItems(backendCart)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [backendUrl])

    useEffect(() => {
        const localCart = getStoredCart()
        if (Object.keys(localCart).length > 0 && !token) {
            setCartItems(localCart)
        }

        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token,
        isLoadingProducts, productsError,
        orders, addOrder
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;