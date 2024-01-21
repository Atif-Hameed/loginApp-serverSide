import mongoose  from "mongoose";
import bcrypt  from 'bcrypt'

interface User{
    password: string;
    isModified(field: string): boolean;
}

const userSchema = new mongoose.Schema({
    fname : {
        type: String,
        require: [true, 'first name required']
    },
    lname : {
        type : String,
        require: [true, 'last name required']
    },
    email : {
        type : String,
        require:[true, 'email required'],
        unique: [true, 'email already exist']
    },
    password : {
        type: String,
        require : [true, 'Password required']
    },
    adress : {
        type : String,
        require : [true, 'adress required']
    }
}, {timestamps: true})

userSchema.pre<User>('save', async function(next){     //<User> is set here cuz typescript restirict to recognize this.password and isModified method
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

export const userModel = mongoose.model('users', userSchema)