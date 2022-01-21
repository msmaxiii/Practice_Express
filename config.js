const mongoose = require('mongoose')

async function main(){
    await mongoose.connect(process.env.MONGODB_URII)
}
module.exports = main
