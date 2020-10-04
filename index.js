const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const fs = require('fs');
const puppeteer = require('puppeteer');
const Browser = require('./browser')





app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + "/public")))


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

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()

})

app.use('/admin', admin)

app.get("/", async (req, res) => {

    const browser = await Browser.initPage();

    console.log("aquiiiiiiiiiiiiiii",browser);
    await main(browser);

    // fs.unlink('./public/img/screen.jpg', (err) => {        
    //     console.log(err);
    // });

    const whatsConnected = await whats(browser)


    return whatsConnected ? res.redirect('/test') : res.redirect('/');

})

app.get("/test", (req, res) => {
    res.render('admin/concluido')
    //enviarWhats()
})





const screenshot = './public/img/screen.jpg'


async function whats(browser) {
   
    
    const page2 = await browser.newPage();

    await page2.setViewport({ width: 1000, height: 600 });

    await page2.goto('https://web.whatsapp.com/send?phone=5554991808575&text=ola', { waitUntil: 'domcontentloaded' })
    await page2.waitForSelector('#app > div > div > div.landing-window > div.landing-main > div > div._2nIZM > div > div')

    await page2.screenshot({ path: screenshot, clip: { x: 450, y: 80, width: 600, height: 600 } })
    //await page2.close();
    await page2.waitFor(2000);
    //await browser.close()
    return true;
}

async function enviarWhats(browser) {

    const page2 = await browser.newPage();


    //await page2.goto('https://web.whatsapp.com/send?phone='+numberDDD+'&text='+mensagem, {waitUntil:'domcontentloaded'});
    await page2.waitForSelector('#main > footer > div._3ee1T._1LkpH.copyable-area > div:nth-child(3) > button > span');
    await page2.click('#main > footer > div._3ee1T._1LkpH.copyable-area > div:nth-child(3) > button > span');
    await page2.waitForSelector('#main > div._3h-WS > div > div > div.z_tTQ > div:nth-child(11) > div > div > div > div._2frDn > div > div > span > svg');
    await page2.waitForSelector('input[name="a"]');
    await browser.close();

}





const dataInicial = '01/01/2020'
const dataFinal = '01/12/2020'


async function main(browser) {
    try {

        const page = await browser.newPage();
        console.log(page,"euuuuuuuuuu");

        await page.goto('http://cloud5.ren9ve.com.br/BIOCARE/Ren9veERP/CL_OrdensServicosNew.aspx');
        await page.waitFor('input[name="ctl00$ContentPlaceHolder1$txtLogin"]');
        await page.type('input[name="ctl00$ContentPlaceHolder1$txtLogin"]', 'oscarbio', { delay: 100 });
        await page.type('input[name="ctl00$ContentPlaceHolder1$txtSenha"]', 'ger3729', { delay: 100 });
        await page.keyboard.press('Enter');
        await page.click('#ContentPlaceHolder1_btnLogin');

        await filtrosDatas(dataInicial, dataFinal).then(() => filtrosOSFutura().then(() => numeroCliente()).then((numberDDD) => console.log(numberDDD)));



        async function filtrosDatas(dataInicial, dataFinal) {
            await page.waitForSelector('#ContentPlaceHolder1_AppContentPlaceHolder_lnkMaisOpcoes') //Link filtros
            await page.click('#ContentPlaceHolder1_AppContentPlaceHolder_lnkMaisOpcoes', { delay: 50 });

            await page //0 - abertura // 2 - Finalizado
                .waitForSelector('#ContentPlaceHolder1_AppContentPlaceHolder_rblData_2')
                .then(() => page.click('#ContentPlaceHolder1_AppContentPlaceHolder_rblData_0', { delay: 1000 }));
            //Datas
            await page.type('input[name="ctl00$ctl00$ContentPlaceHolder1$AppContentPlaceHolder$txtDataInicial"]', dataInicial, { delay: 100 });
            await page.type('input[name="ctl00$ctl00$ContentPlaceHolder1$AppContentPlaceHolder$txtDataFinal"]', dataFinal, { delay: 100 });
        }

        async function filtrosOSFutura() {
            await page.select('#ContentPlaceHolder1_AppContentPlaceHolder_drlCodOrdensServicosNewStatusTipos', '23');//tipo
            await page.waitFor(3000)
                .then(() => page.click('#ctl00_ctl00_ContentPlaceHolder1_AppContentPlaceHolder_drlCodOrdensServicosNewStatus_Arrow', { delay: 200 })) //dropdown
                .then(() => page.waitFor(3000))
                .then(() => page.waitForSelector('#ctl00_ctl00_ContentPlaceHolder1_AppContentPlaceHolder_drlCodOrdensServicosNewStatus_DropDown > div > div > label > input'))
                .then(() => page.click('#ctl00_ctl00_ContentPlaceHolder1_AppContentPlaceHolder_drlCodOrdensServicosNewStatus_DropDown > div > div > label > input', { delay: 200 })) //Check All
                .then(() => page.click('#ContentPlaceHolder1_AppContentPlaceHolder_btnPesquisar', { delay: 200 }))
                .then(() => page.click('#ContentPlaceHolder1_AppContentPlaceHolder_dgdOrdensServicosNew_lnkPosicaoCliente_0 > i')); //cliente toten
        }

        async function numeroCliente() {
            await page.waitFor(4000);
            const number = await page.evaluate(function () {
                return document.querySelector("#ContentPlaceHolder1_AppContentPlaceHolder_modalposicaocliente_lblTelefone").textContent.replace(/[^\d]+/g, '');
            });
            var numberDDD = "55" + number;
            console.log(numberDDD);
            return numberDDD;
        }



    } catch (err) {
        console.log(err);
    }
}
