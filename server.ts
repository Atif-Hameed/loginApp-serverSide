import express from 'express'
import cors from 'cors'
import ConnectDb from './config/config'
import dotenv from 'dotenv'

//env config
dotenv.config();

//monogdb config
ConnectDb();

//rest object
const app = express()

//middlewares
app.use(cors())
app.use(express.json())

//routes import
import testRouter from './routes/test'

//routes
app.use('/api/v1', testRouter)

//test
app.get('/', (req, resp) => {
    return resp.status(200).send({
        success : true,
        message : 'API WORKS FINE'
    })
})

//port
const PORT = process.env.PORT || 8000

//listen
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT} on ${process.env.NODE_ENV} mode`)
})