import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors";

import campaignsRoute from "./routes/campaigns.js"

dotenv.config()
const app = express();

const connect = () => {
    try {
        mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (err) {
        throw err
    }
}


app.get('/', (req, res) => {
    res.send("hello")
})

mongoose.connection.on("disconnected", ()=> {
    console.log("mongoDB disconnected");
})


// Middlewares
// cors middleware
app.use (cors());
// json requests middleware
app.use(express.json())

app.use("/api/v1/campaigns", campaignsRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json(
        {
            success: false,
            status: errorStatus,
            message: errorMessage,
            stack: err.stack // more error details
        }
    )
})

app.listen(8800, () => {
    connect()
    console.log("connected to 8800")
})
