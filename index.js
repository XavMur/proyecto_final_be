const express = require('express')
const app = express()

const {productosPorCategoria} = require('./consultas.js')

app.listen(3000, console.log("Servidor funcionando"))

app.get('/productos', async(req, res)=>{
    const categorias = req.query.categoria
    const productos = await productosPorCategoria(categorias)
    res.json(productos)

})