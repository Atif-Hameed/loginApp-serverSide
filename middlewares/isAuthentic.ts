import {Response, Request, NextFunction} from 'express'
import { userModel } from '../models/userModel'
import jwt, {JwtPayload} from 'jsonwebtoken'

interface middlewareTypes{
    (req: Request, res: Response, next: NextFunction):void
}

export const isAuthentic:middlewareTypes = async(req, res, next) => {
    try {
        const {token} = req.cookies
        if(!token){
            return res.status(401).send({
                success : false,
                message : 'UnAuthorized User'
            })
        }
        const decodeData = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload
        const userExist = await userModel.findById(decodeData._id)

        next ();

    } catch (error) {
        res.status(500).send({
            success : false,
            message : 'Authentication Failed',
            error
        })
    }
}


//storeOTP
export const localVariables:middlewareTypes = (req, res, next) => {
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
    // this is way to store something throughout the one time req-res-life cycle
}