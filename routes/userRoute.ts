import express from 'express'
import { signUpController } from '../controllers/usersController'

const router = express.Router()

router.post('/register', signUpController)

export default router