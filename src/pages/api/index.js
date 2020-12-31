
import puppeteer from 'puppeteer'
// export default async (req, res) =>  {}

async function browser(password, login, inicialDateFomated, finalDateFomated) {
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
    await page.waitForTimeout(2000)

    try {
      await page.waitForSelector("#Body > div.ui-pnotify.animated.ui-pnotify-mobile-able.ui-pnotify-in.bounceInLeft.ui-pnotify-move", { timeout: 3000 })
      browser.close();
      return 'Login ou Senha Invalidos'
    } catch (error) {
      console.log("The element appear.")
    }

    await page.waitForSelector('#ContentPlaceHolder1_AppContentPlaceHolder_AppContentPlaceHolderCRM_txtDataInicial')
    await page.type('input[name="ctl00$ctl00$ctl00$ContentPlaceHolder1$AppContentPlaceHolder$AppContentPlaceHolderCRM$txtDataFinal"]', finalDateFomated, { delay: 80 })
    await page.type('input[name="ctl00$ctl00$ctl00$ContentPlaceHolder1$AppContentPlaceHolder$AppContentPlaceHolderCRM$txtDataInicial"]', inicialDateFomated, { delay: 80 })
    await page.select('#ContentPlaceHolder1_AppContentPlaceHolder_AppContentPlaceHolderCRM_drlCodUsuariosResponsavel', '29')
    await page.click('#ContentPlaceHolder1_AppContentPlaceHolder_AppContentPlaceHolderCRM_rblPeriodo_1', { delay: 50 });
    await page.click('#ContentPlaceHolder1_AppContentPlaceHolder_AppContentPlaceHolderCRM_btnPesquisar', { delay: 150 });
    await page.waitForTimeout(3000)

    const boolListTasks = await page.evaluate(() => {
      return document.querySelector("#ContentPlaceHolder1_mainMasterPage").textContent.includes("Atividade")
    });

    if (!boolListTasks) {
      browser.close();
      return 'Nenhuma tarefa prevista para esse período de tempo'
    }
    //  !await page.waitForFunction('document.querySelector("#ContentPlaceHolder1_mainMasterPage").innerText.includes("Atividade")') //Test if thare was a selector in page, replace page.evaluate, but execute everlastily

    const listNames = await page.evaluate(() => {
      let listNamesDom = []
      for (let i = 0; i < 10; i++) {
        var row = document.querySelector("#ContentPlaceHolder1_AppContentPlaceHolder_AppContentPlaceHolderCRM_dgdTarefas_lnkConta_" + i);
        if (row === null) break
        listNamesDom.push(row.textContent)
      }
      const listNamesDomWishoutRepetition = new Set(listNamesDom);
      const listNamesDomToArrayAgain = [...listNamesDomWishoutRepetition];

      return listNamesDomToArrayAgain
    })
    browser.close();

    return listNames

  } catch (e) {

    return 'Erro ao acessar'
  }

}

async function handler(req, res) {

  if (req.method === "POST") {
    if (req.headers.referer === "http://localhost:3000/") {
      const returnMessage = await browser(req.body.password, req.body.login, req.body.inicialDateFomated, req.body.finalDateFomated)
      typeof returnMessage === "string"
        ? res.json({ message: returnMessage })
        : res.json({ message: false, list: returnMessage })
    } else {
      res.json({ message: "No permission to access" })
    }

  } else {
    res.json({ message: "No permission to access" })
  }
}

export default handler