const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = Schema({
    nome: {
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    eadmin:{
        type: Number,
        default: 0
    },
    senha:{
        type: String,
        require: true
    }
})

mongoose.model('usuarios', Usuario)