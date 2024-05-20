const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const {
    productosPorCategoria, 
    getCategorias, 
    getTendencias, 
    getProduct, 
    verifyUser, 
    addUser2ndlogin, 
    updateProfile, 
    getUserData,
    handleCartData,
    getCartItems
} = require('./consultas.js')
app.listen(3000, console.log("Servidor funcionando"));
app.use(cors());

app.get("/productos", async (req, res) => {
    try{
        const categorias = req.query.categoria;
        const productos = await productosPorCategoria(categorias);
        res.json(productos);
    }catch(error){
        res.status(500).send(`Error interno del servidor, no se recibieron categorias`);
    }
});

app.get("/categorias", async (req, res) => {
    try {
        const categorias = await getCategorias();
        res.json(categorias);
    }catch(error){
        res.status(500).send(`Error interno del servidor`);
    }
});

app.get("/tendencias", async (req, res) => {
    try{
        const tendencias = await getTendencias();
        res.json(tendencias);
    }catch(error){
        res.status(500).send(`Error interno del servidor`);
    }

});

app.get("/producto", async (req, res) => {
    try{
        const prodId = req.query.id;
        const producto = await getProduct(prodId);
        res.json(producto);
    }catch(error){
        res.status(500).send(`Error interno del servidor`);
    }

});

app.use(express.json());
app.post('/usuarios', async(req, res)=>{
    try{
        const usuario = req.body;
        const verificacion = await verifyUser(usuario);
        res.json(verificacion);
    }catch(error){
        if (error.message) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send(`Error interno del servidor`);
        }
    }
})

app.post('/usuarioLogin2', async(req, res) =>{
    try{
        const emailVerificacion = req.body;
        const verificacion = await addUser2ndlogin(emailVerificacion);
        const token = jwt.sign(emailVerificacion.email,"az_AZ");
        res.json({
            verificacion: verificacion,
            token: token
        });
    }catch(error){
        res.status(500).send(`Error interno del servidor`);
    }
})

app.post("/profileUpdate", async (req, res) => {
  try{
    const datos = req.body;
    const producto = await updateProfile(datos);
    res.json(producto);
  }catch(error){
        res.status(500).send(`Error interno del servidor`);
    }
});

app.post("/getUserData", async(req, res) =>{
    try{
        const datos = req.body;
        console.log(datos);
        const datosUsuario = await getUserData(datos);
        res.json(datosUsuario);
    }catch(error){
        res.status(500).send(`Error interno del servidor`);
    }
})

app.post("/cartData", async(req, res) =>{
    try{
        const datos = req.body;
        const response = await handleCartData(datos);
        res.json(response);

    }catch(error){
        res.status(500).send(`Error interno del servidor`);
    }
})

app.post("/getCartItems", async(req, res) =>{
    try{
        const datos = req.body;
        const response = await getCartItems(datos);
        res.json(response);

    }catch(error){
        res.status(500).send(`Error interno del servidor`);
    }
})