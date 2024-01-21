import { Request, Response } from 'express'
import { userModel } from '../models/userModel'

interface controllerTypes {
    (req: Request, res: Response): void
}

export const signUpController: controllerTypes = async (req, res) => {

    try {
        const { fname, lname, email, password, adress } = req.body
        if(!fname || !lname || !email || !password || !adress){
            return res.status(401).send({
                success : false,
                message : 'Please provide all the cridentials'
            })
        }

        const userExist = await userModel.findOne({ email })
        if (userExist) {
            return res.status(500).send({
                success: false,
                message: 'User already exists'
            })
        }
        const user = await userModel.create({
            fname, lname, email, password, adress
        })
        res.status(200).send({
            success: true,
            message: 'SignUp Successfully!',
            user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'SignUp API Error',
            error
        })
    }

}