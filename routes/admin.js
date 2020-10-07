const express = require('express')
//const { Router } = require('express')
const router = express.Router()

router.get('/', function(req, res) {
    res.render('admin/formulario');

});


router.post('/coleta', function(req, res) {

    var erros=[];

    if(!req.body.dataInicial || req.body.dataInicial==undefined || req.body.dataInicial==null){
        erros.push({text: 'Data Inicial inválida'})
    }
    if(!req.body.dataFinal || req.body.dataFinal==undefined || req.body.dataFinal==null){
        erros.push({text: 'Data Final inválida'})
        
    }
    
    if(erros.length>0){

        req.flash("error_msg", "Tudo não ok")

        res.redirect('/admin'); //caso se for render, passaar 2º param -> , {erros: erros}

    }else{
        console.log(req.body.dataFinal+" e "+req.body.dataInicial);

        req.flash("success_msg", "Tudo ok")
    
    
        res.redirect('/admin');
    } 
});


module.exports = router