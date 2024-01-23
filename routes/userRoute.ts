import express from 'express'
import { getUserController, optGenerateController, registerEmailController, setnewPassController, signUpController, singInController, updateUserController, verifyOTPCOntroller } from '../controllers/usersController'
import { verifyUser } from '../middlewares/verifyUser'
import { isAuthentic, localVariables } from '../middlewares/isAuthentic'

const router = express.Router()

//registerUser
router.post('/register', signUpController)

//loginUSer
router.post('/login', singInController)

//getUserData
router.get('/getUser/:userName', getUserController)

//updateUserData
router.put('/updateUser', isAuthentic, updateUserController)

//generateOTP
router.get('/generateOtp', verifyUser, localVariables, optGenerateController)

//verifyOTP
router.get('/verifyOTP', verifyOTPCOntroller)

//ResetPassword
router.put('/setNewPass', verifyUser, setnewPassController)

//registerEmail
router.post('/registerMail', registerEmailController)

export default router