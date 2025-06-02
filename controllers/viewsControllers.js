const vistaInicio = (req,res)=>{
    res.render('inicio');
}
const vistaControl= (req,res)=>{
    res.render('control');
}
const vistaAdministrar = (req,res)=>{
    res.render('administrar');
}

module.exports= {
    vistaInicio,
    vistaControl,
    vistaAdministrar
}