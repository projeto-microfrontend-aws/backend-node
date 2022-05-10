const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/postagens")
const Postagem = mongoose.model("postagens")
const {eAdmin}= require("../helpers/eadmin")


//GRUPO DE ROTAS ADMISTRATIVAS
router.get('/categorias', eAdmin,(req, res) =>{
    Categoria.find().sort({date: 'desc'}).then((categorias) =>{
        res.send( categorias)
    }).catch((err)=>{
        res.status(403).send(err)
    })
})

router.post('/categorias/nova', eAdmin, (req,res) =>{
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then((res)=>{
        res.send(res)
    }).catch((erro)=>{
        res.send(erro)
    })
})

router.get("/categorias/edit/:id", eAdmin, (req,res)=>{
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.send(categoria)
    }).catch((err)=>{
        res.send(err)
    })
})

router.post("/categorias/edit",  eAdmin,(req,res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then((res)=>{
            res.send(res)
        }).catch((err)=>{
            res.send(err)
        })

    }).catch((err)=>{
        res.send(err)
    })
})

router.post("/categorias/deletar",  eAdmin, (req,res)=>{
    Categoria.remove({_id: req.body.id}).then((res)=>{
        res.send(res)
    }).catch((err)=>{
        res.send(err)
    })
})

router.get("/postagens",  eAdmin, (req,res)=>{
    Postagem.find().populate("categoria").sort({date: "desc"}).then((postagens)=>{
        res.send(postagens)
    }).catch((err)=>{
        res.send(err)
    })

})

router.get("/postagens/add",  eAdmin, (req,res)=>{
    Categoria.find().sort({nome: -1}).then((categorias)=>{
        res.send(categorias)
    }).catch((err)=>{
        res.send(err)
    })

})


router.post("/postagens/nova", eAdmin, (req,res)=>{


    const novaPostagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }
    new Postagem(novaPostagem).save().then((res)=>{
        res.send(res)
    }).catch((erro)=>{
        res.send(erro)
    })
})


router.get("/postagens/edit/:id",  eAdmin,(req,res)=>{
    Postagem.findOne({_id: req.params.id}).then((postagem)=>{
        Categoria.find().then((categorias)=>{
            res.send( {categorias: categorias, postagem: postagem})
        }).catch((err)=>{
            res.send(err)
        })

    }).catch((err)=>{
        res.send(err)
    })
})

router.post("/postagem/edit",  eAdmin,(req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
        
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then((res)=>{
            res.send(res)
        }).catch((err)=>{
            res.send(err)
        })

    }).catch((err)=>{
        res.send(err)
    })
})

router.get('/postagens/deletar/:id', eAdmin, (req,res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{
        res.send("postagem deletada com sucesso")
    }).catch((err)=>{
        res.send(err)
    })
})
module.exports = router
