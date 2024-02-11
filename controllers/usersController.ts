import { Request, Response, response } from 'express'
import { userModel, User } from '../models/userModel'
import otpGenerate from 'otp-generator'
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from './mailer'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface controllerTypes {
    (req: Request, res: Response): void
}

//Register
export const signUpController: controllerTypes = async (req, res) => {

    try {
        const { email, password, userName, profile } = req.body
        if (!email || !password || !userName) {
            return res.status(401).send({
                success: false,
                message: 'Please provide all the cridentials'
            })
        }

        const userExist: User | null = await userModel.findOne({ email });
        if (userExist) {
            return res.status(409).send({
                success: false,
                message: 'User already exists'
            })
        }

        const userNameExist = await userModel.findOne({ userName })
        if (userNameExist) {
            return res.status(400).send({
                success: false,
                message: 'UserName already exist, try a unique one'
            })
        }

        const user = await userModel.create({
            email, password, userName, profile: ''
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


//login
export const singInController: controllerTypes = async (req, res) => {
    try {
        const { userName, password } = req.body
        if (!userName || !password) {
            return res.status(401).send({
                success: false,
                message: 'Please provide all cridentals '
            })
        }
        const user = await userModel.findOne({ userName })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found'
            })
        }

        const validPass = await user.comparePassword(password)

        if (!validPass) {
            return res.status(401).send({
                success: false,
                message: 'Invalid cridentials',
                error: response
            })
        }

        const token = user.generateToken()

        res.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }).send({
            success: true,
            message: 'Login Successfully',
            token,
            // user
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'SingIN API Error',
            error
        })
    }
}


//getUser
export const getUserController: controllerTypes = async (req, res) => {
    try {
        const { userName } = req.params

        if (!userName) {
            return res.status(501).send({
                success: false,
                message: 'Invalid or missing userName'
            })
        }
        const user = await userModel.findOne({ userName })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).send({
            success: true,
            message: 'User Found',
            user
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Get User API Error',
            error
        })
    }
}


//updateUser Data
export const updateUserController: controllerTypes = async (req, res) => {
    try {
        const { token } = req.cookies
        const decodeData = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload
        const user = await userModel.findById(decodeData.id)
        const { fname, lname, mobile, email, adress, userName } = req.body
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
        if (fname) user.fname = fname
        if (lname) user.lname = lname
        if (mobile) user.mobile = mobile
        if (adress) user.adress = adress
        if (email) user.email = email
        if (userName) user.userName = userName

        await user.save()
        res.status(200).send({
            success: true,
            message: 'Data updated successfully'
        })
    } catch (error: any) {
        //Cast error || object ID error
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Update User Data API Error',
            error
        })
    }
}


// GenerateOTP
export const optGenerateController: controllerTypes = async (req, res) => {
    try {
        req.app.locals.OTP = otpGenerate.generate(5, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        res.status(200).send({
            success: true,
            message: 'OTP sent successfully',
            Code: req.app.locals.OTP
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'OTP Generate API Error',
            error
        })
    }
}


//verifyOTP
export const verifyOTPCOntroller: controllerTypes = (req, res) => {
    try {
        const { Code } = req.query

        if (req.app.locals.OTP === Code) {
            req.app.locals.OTP = null,
                req.app.locals.resetSession = true,
                res.status(200).send({
                    success: true,
                    message: 'OTP verified successfully'
                })
        }
        return res.status(400).send({
            Success: false,
            message: 'Invalid OTP'
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'OTP Verify API Error',
            error
        })
    }

}


//resetSession
export const createResetSession: controllerTypes = (req, res) => {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false
        return res.status(200).send({
            success: true,
            message: 'Access granted!'
        })
    }
    return res.status(440).send({
        success: false,
        message: 'Session Expired!'
    })
}

//requestResetPassword and token generate
// export const requestResetPassController: controllerTypes = async (req, res) => {
//     try {
//         const { email } = req.body
//         if (!email) {
//             return res.status(500).send({
//                 success: false,
//                 message: 'Please provide the email adress'
//             })
//         }
//         const user = await userModel.findOne({ email })
//         if (!user) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'User not found'
//             })
//         }
//         const resetToken = jwt.sign({ id: user._id }, process.env.JWT_KEY!, { expiresIn: '1h' })
//         return res.status(200).json({
//             success: true,
//             message: 'Reset token generated successfully',
//             resetToken,
//         });
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: 'Request Reset Password API Error',
//             error
//         })
//     }
// }


//SetNewwPass
export const setnewPassController: controllerTypes = async (req, res) => {
    try {

        if (!req.app.locals.resetSession) {
            return res.status(440).send({
                success: false,
                message: 'Session Expired'
            })
        }

        const { userName, newPass } = req.body
        const user = await userModel.findOne({ userName })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'UserName not found'
            })
        }
        const hashedPass = await bcrypt.hash(newPass, 10)

        if (hashedPass) {
            await userModel.updateOne({ userName: userName }, { password: hashedPass })
            req.app.locals.resetSession = false
        } else {
            return res.status(400).send({
                success: false,
                message: 'Enabled to hashed password'
            })
        }
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Record Updated successfully...',
            pass: hashedPass
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'OTP Generate API Error',
            error
        })
    }
}


//registerEmail
export const registerEmailController: controllerTypes = async (req, res) => {
    try {
        const { userName, email, msg } = req.body
        // const user = await userModel.findOne({userName})
        // if(!user){
        //     return res.status(404).send({
        //         success : false,
        //         message : 'User not exist'
        //     })
        // }
        await sendVerificationEmail(userName, email, msg);
        res.status(200).send({
            success: true,
            message: 'Email send successfully! Please verify'
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Register mail API Error',
            error
        })
    }
}