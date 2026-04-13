import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";


// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize


// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}



// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const userId = req.userId || req.body.userId

        if (!userId) {
            return res.json({success:false,message:'User not found'})
        }

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const orderId = req.params.id || req.body.orderId
        const { status } = req.body

        if (!orderId) {
            return res.json({success:false,message:'Order id is required'})
        }

        if (!status) {
            return res.json({success:false,message:'Status is required'})
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })

        if (!updatedOrder) {
            return res.json({success:false,message:'Order not found'})
        }

        res.json({success:true,message:'Status Updated',order:updatedOrder})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {placeOrder, allOrders, userOrders, updateStatus}