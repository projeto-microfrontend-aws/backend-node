//Carregando módulos
    const express = require('express')
    const bodyParser = require("body-parser")
    const app = express()
    const admin = require("./routes/admin") 
    const mongoose = require('mongoose')
    const session = require("express-session")
    const flash = require("connect-flash")
    require("./models/postagens")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuarios = require("./routes/usuario")
    const passport = require("passport")
    require("./config/auth")(passport)
    const db = require("./config/db")

//Configurações
    //sessão
        app.use(session({
            secret: "qualquer coiisa",
            resave: true,
            saveUninitialized: true
        }))    

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //middlewares
        app.use((req, res, next) =>{
            res.locals.user = req.user || null;
            next()
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect( db.mongoURI, {
            useNewUrlParser: true
        }).then(()=>{
            console.log("Conectado com o mongo")
        }).catch((err)=>{
            console.log("Erro ao se conectar: " + err)
        })
    //Public

////gitRotas
app.get('/', (req, res) => {
    Postagem.find().populate("categoria").sort({date: "desc"}).then((postagens)=>{
        console.log('postagens', postagens)
        res.send(postagens)
    }).catch((err)=>{
        res.status(503).send(err)
    })
})
app.get("/postagem/:slug",(req,res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
        if(postagem){
            res.send( postagem)
        }else{
            res.status(422).send( 'postagem inexistente')
        }
    }).catch((err)=>{
        res.status(503).send(err)
    })
})

app.get('/categorias', (req, res) => {
    Categoria.find().then((categorias)=>{
        res.send( categorias)
    }).catch((err) => {
        res.send(err)
    })
})


app.get("/categorias/:slug", (req,res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens) => {             
                res.send({postagens: postagens, categoria: categoria})
            }).catch((err) => {
                res.send(err)
            })
        }else{
            res.status(422).send("não encontrado")
        }
    }).catch((err) => {
        req.status(503).send(err)
    })
})

app.use("/admin", admin)
app.use("/usuarios", usuarios)

//Outros
const PORT = process.env.PORT||8082
app.listen(PORT, ()=>{
    console.log("Sevidor rodando! Porta: " + 8082)
})
