const express = require('express')
const app = express()
const cors = require('cors')


const {productosPorCategoria, getCategorias, getTendencias, getProduct} = require('./consultas.js')

app.listen(3000, console.log("Servidor funcionando"))
app.use(cors())

app.get('/productos', async(req, res)=>{
    const categorias = req.query.categoria
    const productos = await productosPorCategoria(categorias)
    res.json(productos)

})

app.get('/categorias', async(req, res) =>{
    const categorias = await getCategorias();
    res.json(categorias)
})

app.get('/tendencias', async(req,res)=>{
    const tendencias = await getTendencias();
    res.json(tendencias)
})

app.get('/producto', async(req, res)=>{
    const prodId = req.query.id;
    const producto = await getProduct(prodId);
    res.json(producto);
})