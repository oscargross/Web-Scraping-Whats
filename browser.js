const puppeteer = require('puppeteer');

module.exports = class Browser{


    static async initPage(){
        return puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"]
        });


    };

};

