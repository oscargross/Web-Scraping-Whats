const express = require('express')
const app = express();

var porta = process.env.PORT || 3000;
app.listen(porta, () => {
    console.log("Eu estou aqui");
})

app.get("/" , (req, res) => {
    res.send("Ola Barbara");
})