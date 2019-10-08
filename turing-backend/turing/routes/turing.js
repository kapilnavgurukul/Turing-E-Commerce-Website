const express=require("express");
const body=require("body-parser");
const mysql=require("mysql");
const app=express();
const server=3000;
const knex=require("knex")({
    client: 'mysql',
    connection:{
        host:"localhost",
        password:"8889040755",
        database: "turingdb",
        user:'root'
    }
})


app.use('/department',department=express.Router());
require('./department')(department,knex);

app.use('/categories',categories=express.Router());
require('./category')(categories,knex)


app.listen(server,()=>{
    console.log(`your server is listning on port ${server}`)
})https://meet.google.com/mbh-iagy-yig