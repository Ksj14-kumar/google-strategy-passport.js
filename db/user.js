const mongoose = require('mongoose');



const Schema = new mongoose.Schema({
    name: { type: String, required: true },
    googleID: String
})



module.exports = mongoose.model("userCollcction1", Schema)