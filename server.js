const express=require("express");
const bodyParser=require("body-parser");
const mysql=require("mysql");
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config();
const app=express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
const port=parseInt(process.env.PORT)
const secret_key=process.env.secret_key
console.log(typeof(port))
const knex=require("knex")({
    client: 'mysql',
    connection:{
        host:process.env.HOST,
        password:process.env.PASSWORD,
        database: process.env.DB_NAME,
        user:process.env.USERNAME
    }
})

require('./routes/create_table')(knex)

app.use('/department',department=express.Router())
require('./routes/department')(department,knex,secret_key)

app.use("/categories",category=express.Router())
require("./routes/category")(category,knex,secret_key)

app.use("/attributes",attributes=express.Router())
require("./routes/attributes")(attributes,knex,secret_key)

app.use("/products",product=express.Router())
require("./routes/product")(product,knex,jwt,secret_key)

app.use("/customer",customer=express.Router())
require("./routes/customer")(customer,knex,jwt,secret_key)

app.use("/orders",orders=express.Router())
require("./routes/orders")(orders,knex,jwt,secret_key)

app.use("/shoppingcart",shoppingcart=express.Router())
require("./routes/shoppingcart")(shoppingcart,knex,jwt,secret_key)

app.use("/tax",tax=express.Router())
require('./routes/tax')(tax,knex,jwt,secret_key)

app.use('/shipping',shipping=express.Router())
require("./routes/shipping")(shipping,knex,jwt,secret_key)

app.listen(port,()=>{
    console.log(`server is listning on port ${port}`)
})
