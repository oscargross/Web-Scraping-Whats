const express = require('express')
const app =  express()
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended:true})) 
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname+"/public")))


var porta = process.env.PORT || 3000;
app.listen(porta, () => {
    console.log("Eu estou aqui");
})

app.use(session({
    secret: 'scraping2',
    resave: true,
    saveUninitialized: true

}))
app.use(flash())

//MiddleWare

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()

})


app.get("/" , (req, res) => {
    res.send("Ola Barbara meu amorr");
})



//Routes:
app.use('/admin', admin)

