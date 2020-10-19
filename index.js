const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const puppeteer = require('puppeteer');
const path = require('path')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + "/public")))


var porta = process.env.PORT || 3000;
app.listen(porta, () => {
    console.log("Eu estou aqui");
})

app.use('/admin', admin)
var dataFinal="";
var dataInicial="";

app.post('/val', (req, res) => {
    const msg = req.body.msg
    const login = req.body.login
    const password = req.body.password
    const df= req.body.dataFinal.split("-")
    const di= req.body.dataInicial.split("-")
    dataInicial=(di[2]+'/'+di[1]+'/'+di[0]);
    dataFinal=(df[2]+'/'+df[1]+'/'+df[0]);
    res.sendFile('./views/loading.html', { root: __dirname })
    main(login, password, dataInicial, dataFinal);

});


app.get("/", (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname })
    //main();
    //res.redirect('/aqui')

})
async function main(login, password, dataInicial, dataFinal){
    try {

        const browser = await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox"]
        });
        const page = await browser.newPage();

        await page.goto('http://cloud5.ren9ve.com.br/BIOCARE/Ren9veERP/CL_Tarefas.aspx');
        await page.waitForSelector('input[name="ctl00$ContentPlaceHolder1$txtLogin"]');
        await page.type('input[name="ctl00$ContentPlaceHolder1$txtLogin"]', login, { delay: 100 });
        await page.type('input[name="ctl00$ContentPlaceHolder1$txtSenha"]', password, { delay: 100 });
        await page.keyboard.press('Enter');
        await page.click('#ContentPlaceHolder1_btnLogin');
        await page.waitForSelector('#ContentPlaceHolder1_AppContentPlaceHolder_AppContentPlaceHolderCRM_txtDataInicial')
        await page.type('input[name="ctl00$ctl00$ctl00$ContentPlaceHolder1$AppContentPlaceHolder$AppContentPlaceHolderCRM$txtDataInicial"]', dataInicial, {delay: 100})
        await page.type('input[name="ctl00$ctl00$ctl00$ContentPlaceHolder1$AppContentPlaceHolder$AppContentPlaceHolderCRM$txtDataFinal"]', dataFinal, {delay: 100})
        await page.select('#ContentPlaceHolder1_AppContentPlaceHolder_AppContentPlaceHolderCRM_drlCodUsuariosResponsavel', '29')
        await page.click('#ContentPlaceHolder1_AppContentPlaceHolder_AppContentPlaceHolderCRM_btnPesquisar', {delay: 50});

        await page.waitFor('asa')
        //await filtrosDatas(dataInicial, dataFinal).then(() => filtrosOSFutura().then(() => numeroCliente()).then((numberDDD) => console.log(numberDDD)));


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

        async function enviarWhats(mensagem, numberDDD) {
            const page2 = await browser.newPage();

            await page2.goto('https://web.whatsapp.com/send?phone=' + numberDDD + '&text=' + mensagem, { waitUntil: 'domcontentloaded' });
            await page2.waitForSelector('#main > footer > div._3ee1T._1LkpH.copyable-area > div:nth-child(3) > button > span');
            await page2.click('#main > footer > div._3ee1T._1LkpH.copyable-area > div:nth-child(3) > button > span');
            await page2.waitForSelector('#main > div._3h-WS > div > div > div.z_tTQ > div:nth-child(11) > div > div > div > div._2frDn > div > div > span > svg');
            await page.waitForSelector('input[name="a"]');
            await browser.close();

        }




    } catch (err) {
        console.log(err);
    }
}
