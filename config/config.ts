import mongoose from 'mongoose'

const ConnectDb = async() => {
    try {
        const mongUrl = process.env.MONGO_URL
        await mongoose.connect(mongUrl!)
        console.log(`MongoDB Connected: ${mongoose.connection.host}`)
    } catch (error) {
     console.log(`MongoDb Error : ${error}`)   
    }
}

export default ConnectDb;