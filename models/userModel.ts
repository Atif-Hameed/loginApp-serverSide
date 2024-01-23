import mongoose  from "mongoose";
import bcrypt  from 'bcrypt'
import jwt from 'jsonwebtoken'


export interface User extends Document {
    userName : string,
    fname: string;
    lname: string;
    email: string;
    password: string;
    adress: string;
    mobile: number;
    profile: string;
    isModified(field: string): boolean;
    comparePassword(plainPassword: string): Promise<boolean>;
    generateToken():Promise<boolean>
}

const userSchema = new mongoose.Schema<User>({
    userName : {
        type : String,
        require : [true, 'Please provide unique username'],
        unique : true
    },
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
        unique: true
    },
    password : {
        type: String,
        require : [true, 'Password required']
    },
    adress : {
        type : String,
        require : [true, 'adress required']
    },
    mobile : {
        type : Number
    },
    profile : {
        type : String
    }
}, {timestamps: true})



//encrypt Password
userSchema.pre<User>('save', async function(next){     //<User> is set here cuz typescript restirict to recognize this.password and isModified method
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})


// Remove password field when converting to JSON
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};


//generate token
userSchema.methods.generateToken = function(){
    return jwt.sign({id:this.id}, process.env.JWT_KEY!, {expiresIn:'7d'})
}


//decrypt Password
userSchema.methods.comparePassword = async function (this: User, plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
};

export const userModel = mongoose.model<User>('users', userSchema)