import express from 'express';
import { loginUser,registerUser,adminLogin } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import userModel from '../models/userModel.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.get('/profile', authUser, async (req, res) => {
	try {
		const user = await userModel.findById(req.user.id).select('-password');

		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		res.json({ success: true, user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
})

export default userRouter;