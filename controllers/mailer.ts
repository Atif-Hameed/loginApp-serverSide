import nodemailer from 'nodemailer'
import { userModel } from '../models/userModel';

export const sendVerificationEmail = async (email: string, userName: string, msg?:string) => {
    try {
        const user = await userModel.findOne({ email })
        // const token = user?.generateToken()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.APP_MAIL,
                pass: process.env.APP_PASS,
            },
        });

        await transporter.sendMail({
            from : 'atifhameed11312@gmail.com',
            to : 'mohsinhameed113@gmail.com',
            subject : 'OTP Verification',
            text : `Hi ${userName}! `,
            html : `${msg}`,
        })

    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

