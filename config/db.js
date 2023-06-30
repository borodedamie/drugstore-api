const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500, 
  connectTimeoutMS: 10000,
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, options)

        console.log(`DB connected ${ conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB
