import {Response, Request, NextFunction} from 'express'
import { userModel } from '../models/userModel'
import jwt, {JwtPayload} from 'jsonwebtoken'

interface middlewareTypes{
    (req: Request, res: Response, next: NextFunction):void
}

export const verifyUser:middlewareTypes = async(req, res, next) => {
    try {
        const {userName} = req.method == 'GET' ? req.query : req.body 

        const user = await userModel.findOne({userName})
        if(!user){
            return res.status(404).send({
                success : false,
                message : 'UnAuthorized User'
            })
        }
        next ();

    } catch (error) {
        res.status(500).send({
            success : false,
            message : 'Authentication Failed',
            error
        })
    }
}