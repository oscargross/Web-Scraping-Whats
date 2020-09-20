const express = require('express')
const app =  express()
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const puppeteer = require('puppeteer');


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

app.use('/admin', admin)

app.get("/" , (req, res) => {
  
    res.send("oii");
    main();

})

const dataInicial = '01/01/2020'
const dataFinal = '01/12/2020'


async function main() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto('http://cloud5.ren9ve.com.br/BIOCARE/Ren9veERP/CL_OrdensServicosNew.aspx');
    await page.waitFor('input[name="ctl00$ContentPlaceHolder1$txtLogin"]');
    await page.type('input[name="ctl00$ContentPlaceHolder1$txtLogin"]', 'oscarbio',{delay:100});
    await page.type('input[name="ctl00$ContentPlaceHolder1$txtSenha"]', 'ger3729',{delay:100});
    await page.keyboard.press('Enter');
    await page.click('#ContentPlaceHolder1_btnLogin'); 

    await filtrosDatas(dataInicial, dataFinal).then(() => filtrosOSFutura().then(() => numeroCliente()));
    


    async function filtrosDatas(dataInicial, dataFinal){
        await page.waitForSelector('#ContentPlaceHolder1_AppContentPlaceHolder_lnkMaisOpcoes') //Link filtros
        await page.click('#ContentPlaceHolder1_AppContentPlaceHolder_lnkMaisOpcoes',{delay:50});
    
        await page //0 - abertura // 2 - Finalizado
        .waitForSelector('#ContentPlaceHolder1_AppContentPlaceHolder_rblData_2')
        .then(() => page.click('#ContentPlaceHolder1_AppContentPlaceHolder_rblData_0',{delay:1000}));
        //Datas
        await page.type('input[name="ctl00$ctl00$ContentPlaceHolder1$AppContentPlaceHolder$txtDataInicial"]', dataInicial, {delay:100});
        await page.type('input[name="ctl00$ctl00$ContentPlaceHolder1$AppContentPlaceHolder$txtDataFinal"]', dataFinal, {delay:100});
    }
      
    async function filtrosOSFutura(){
        await page.select('#ContentPlaceHolder1_AppContentPlaceHolder_drlCodOrdensServicosNewStatusTipos' ,'23');//tipo
        await page.waitFor(3000)
        .then(() => page.click('#ctl00_ctl00_ContentPlaceHolder1_AppContentPlaceHolder_drlCodOrdensServicosNewStatus_Arrow',{delay:200})) //dropdown
        .then(() => page.waitFor(3000))
        .then(() => page.waitForSelector('#ctl00_ctl00_ContentPlaceHolder1_AppContentPlaceHolder_drlCodOrdensServicosNewStatus_DropDown > div > div > label > input')) 
        .then(() => page.click('#ctl00_ctl00_ContentPlaceHolder1_AppContentPlaceHolder_drlCodOrdensServicosNewStatus_DropDown > div > div > label > input',{delay:200})) //Check All
        .then(() => page.click('#ContentPlaceHolder1_AppContentPlaceHolder_btnPesquisar', {delay:200}))
        .then(() => page.click('#ContentPlaceHolder1_AppContentPlaceHolder_dgdOrdensServicosNew_lnkPosicaoCliente_0 > i')); //cliente toten
    }

    async function numeroCliente(){
        await page.waitFor(4000);
        const number = await page.evaluate(function() {
            return document.querySelector("#ContentPlaceHolder1_AppContentPlaceHolder_modalposicaocliente_lblTelefone").textContent.replace(/[^\d]+/g,'');
        });
        var numberDDD = "55"+number;
        console.log(numberDDD);
        return numberDDD;
    }
}
  


//Routes:

