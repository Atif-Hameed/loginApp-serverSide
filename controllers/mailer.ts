import nodemailer from 'nodemailer'
import { userModel } from '../models/userModel';

export const sendVerificationEmail = async (email: string, userName: string) => {
    try {
        const user = await userModel.findOne({ email })
        const token = user?.generateToken()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.APP_MAIL,
                pass: process.env.APP_PASS,
            },
        });

        await transporter.sendMail({
            from : 'atifhameed11312@gmail.com',
            to : 'atifhameed2002@gmail.com',
            subject : 'Test Email Verification',
            text : `Hi ${userName}! Please click the following link to verify your email, `,
            html : `<a href="http://localhost:3000/verifyMail?token=${token}">Verify Email</a>`,
        })

    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

