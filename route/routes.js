const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User =require('../schema/userschema')
const verifyJWT =require('../jwt')

const authRouter = express.Router()

authRouter.get('/',verifyJWT, (req,res)=>{
    User.find((error,result)=>{
        if(error){
            res.status(400).json({message:error.message})
        }
        if(result===undefined || result===null|| result===[]){
            res.status(404).json({message:"user not found"})
        }
        res.status(200).json({data:result})
    })
})

authRouter.post('/register', async(req,res)=>{
    let user = req.body
    let password = user.password
    let username = user.username
    let salt= Number(process.env.SALT)

        if (!password || !username){
            res.status(400).json({message:'Please have a username AND password'})
        }

    let hashedPassword = await bcrypt.hash(password,salt)
    user.password = hashedPassword    


User.create(user,(error,result)=>{
    if(error){
        return res.status(400).json({message:error.message})
    }    
    if(result===undefined || result===null){
        return res.status(400).json({message:'Please make unique user id'})
    }
    res.status(200).json({data:result})

    })
})

authRouter.post('/login',(req,res)=>{
    let username =req.body.username
    let password =req.body.password

    if(!password ||!username){
        res.status(400).json({message:'Please have a usename AND password'})
    }


    User.findOne({username:username},(error, result)=>{
        if (error){
            res.status(404).json({message: error.message})
        }
        if(result===null ||result===undefined ||result===[]){
            res.status(404).json({message:'User Not Found'})
        }
        bcrypt.compare(password,result.password,(error,matching)=>{
            let token = jwt.sign(username,process.env.JWT_SECRET)
              
               if(result===false){
                   res.status(403).json({message:'Either username or password is incorrect'})
               }
               res.setHeader('Authorization',token)
               res.status(200).json({data:result})
              
           })
    })

    
})

module.exports = authRouter