const express = require('express')
const bodyParser = require('body-Parser')
const helmet = require('helmet')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongooseConnect = require('./config')

dotenv.config()
const routes = require('./route/routes')

const app = express()
const port = 4000 || process.env.PORT 


app.use(bodyParser.json())
app.use(helmet())
app.use(morgan('dev'))
app.use('/auth',routes)

app.get('/',(req,res)=>{
    res.status(200).json({message:'API UP'})
})


app.listen(port,()=>{
    mongooseConnect()
    console.log(`Server is listening at ${port}`)
})