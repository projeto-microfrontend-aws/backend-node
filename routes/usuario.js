const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")


router.get("/registro", (req, res) =>{
    Usuario.find().sort({date: 'desc'}).then((usuarios) =>{
        res.send( usuarios)
    }).catch((err)=>{
        res.status(503).send(err)
    })
})

router.post("/registro", (req,res) => {
    var erros =[]

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome ==null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email ==null){
        erros.push({texto: "Email inválido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha ==null){
        erros.push({texto: "Senha inválida"})
    }

    if(req.body.senha.length <4){
        erros.push({texto: "Senha muito curta"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente"})
    }

    if(erros.length >0){
        res.status(422).send( erros)
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                res.send({texto: "Já existe uma conta com este e-mail em nosso sistema"});
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    eadmin: 1
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) =>{
                        if(erro){
                            res.status(503).send({texto: "Houve um erro durante o salvamento do usuario"});
                        }

                        novoUsuario.senha = hash
                        novoUsuario.save().then((user) =>{
                            res.send(user);
                        }).catch((err) => {
                            res.status(503).send(err);
                        })
                    })
                })
            }
        }).catch((err) => {
            res.status(503).send(err);
        })
    }
})



router.post("/login" ,(req, res, next) =>{
    passport.authenticate("local", {
        successRedirect: "/usuarios/login/sucesso",
        failureRedirect: "/usuarios/login/erro",
        failureFlash: true
    })(req, res, next)
})

router.get("/login/erro" ,(req, res, next) =>{
    res.status(422).send({texto: "Usuário ou senha inválidos"})
})
router.get("/login/sucesso" ,(req, res, next) =>{
    res.send(res.locals.user)
})

router.post("/logout", (req,res) => {
    req.logOut()
    res.send("deslogado");
})

module.exports = router
