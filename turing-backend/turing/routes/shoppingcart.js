module.exports=(shoppingcart,knex,jwt)=>{
    knex.schema.hasTable('save_cart').then((exists)=>{
        if (!exists) {
          return knex.schema.createTable('save_cart', function(t) {
            t.integer("item_id");
            t.integer("cart_id");
            t.integer('product_id');
            t.integer('quantity');
            t.string('attributes', 100);
            t.date('added_on');
          });
        }
      });
      
    shoppingcart.post('/add',(req,res)=>{
        let token=req.headers.cookie.slice(0,-10);
        let customer_id=parseInt(jwt.verify(token,"kapil").customer_id)
        let product_id=parseInt(req.body.product_id) 
        let attributes=req.body.attributes;
        knex.select('product_id','item_id','cart_id','quantity').from('shopping_cart').where({'cart_id':customer_id,'product_id':product_id,'attributes':attributes})
        .then((data)=>{
            if (data.length>0){
                let a=data[0].quantity+1
                console.log(data[0])
                knex('shopping_cart').where({item_id:data[0].item_id}).update({quantity:a})
                .then(()=>{res.send("updated")})
                .catch((err)=>{res.send(err)})
            }else{
                let date=new Date()
                knex('shopping_cart').insert({
                    'product_id':product_id,
                    'cart_id':customer_id,
                    'attributes':attributes,
                    'added_on':date,
                    'quantity':1
                })
                .then(()=>{res.send("item added")})
                .catch((err)=>{res.send(err)})
            }
        }).catch((err)=>{res.send(err)})
    })
    shoppingcart.get("/",(req,res)=>{
        let token=req.headers.cookie.slice(0,-10);
        let customer_id=parseInt(jwt.verify(token,"kapil").customer_id)
        knex('product').select('product.product_id','name','image','price','item_id','quantity')
        .join('shopping_cart','product.product_id','shopping_cart.product_id')
        .where({'shopping_cart.cart_id':customer_id,"buy_now":1})
        .then((data)=>{
            for (i of data){i.subprice=i.quantity*i.price}
            res.send(data)
        })
        .catch((err)=>{res.send(err)})
    })
    shoppingcart.put("/update",(req,res)=>{
        let token=req.headers.cookie.slice(0,-10)
        let cart_id=parseInt(jwt.verify(token,"kapil").customer_id)
        let quantity=parseInt(req.body.quantity)
        let item_id=parseInt(req.body.item_id)
        knex('shopping_cart').where({'product_id':item_id,'cart_id':cart_id}).update({'quantity':quantity})
        .then(()=>{res.send("quantity updated")})
        .catch((err)=>{res.send(err)})
    })
    shoppingcart.get("/totalAmount",(req,res)=>{
        let token=req.headers.cookie.slice(0,-10)
        let cart_id=parseInt(jwt.verify(token,"kapil").customer_id)
        knex('product').select('product.product_id','price','quantity')
        .join('shopping_cart','product.product_id','shopping_cart.product_id')
        .where('shopping_cart.cart_id',cart_id)
        .then((data)=>{
            let total={total_amount:0}
            for (i of data){total.total_amount=total.total_amount+i.price*i.quantity}
            res.send(total)
        }).catch((err)=>{res.send(err)})
    })
    shoppingcart.delete("/empty",(req,res)=>{
        let token=req.headers.cookie.slice(0,-10)
        let cart_id=parseInt(jwt.verify(token,"kapil").customer_id)
        knex('shopping_cart').where('cart_id',cart_id).del('*')
        .then(()=>{res.send("all item deleted")})
        .catch((err)=>{res.send(err)})
    }) 
    shoppingcart.delete("/removeproduct",(req,res)=>{
        let token=req.headers.cookie.slice(0,-10)
        let cart_id=parseInt(jwt.verify(token,"kapil").customer_id)
        let item_id_id=parseInt(req.body.item_id)
        knex("shopping_cart").where({'shopping_cart.cart_id':cart_id,'item_id':item_id}).del('*')
        .then(()=>{console.log("yes") 
        res.send("itme deleted")})
        .catch((err)=>{res.send(err)})
    })

    shoppingcart.get("/saveforletter",(req,res)=>{
        let token=req.headers.cookie.slice(0,-10)
        let cart_id=parseInt(jwt.verify(token,"kapil").customer_id)
        let product_id=parseInt(req.body.product_id)
        let item_id=parseInt(req.body.item_id)
        knex('shopping_cart').select('*').where({'cart_id':cart_id,'item_id':item_id})
        .then((data)=>{
            knex('save_cart').select('*').where('item_id',data[0].item_id)
            .then((data1)=>{
                if (data1.length>0){knex('shopping_cart').where({'item_id':item_id,'cart_id':cart_id}).del('*').then(()=>{res.send("save for letter successful")}).catch((err)=>{res.send(err)})}
                else{
                    knex('save_cart').insert({'item_id':data[0].item_id,'product_id':data[0].product_id,'cart_id':data[0].cart_id,'attributes':data[0].attributes,'added_on':data[0].added_on,'quantity':data[0].quantity})
                    .then(()=>{knex('shopping_cart').where({'item_id':item_id,'cart_id':cart_id})}).del('*').then(()=>{res.send("save for letter successful")}).catch((err)=>{res.send(err)})
                }
            }).catch((err)=>{res.send(err)})
        }).catch((err)=>{res.send(err)})
    })

    shoppingcart.get('/movetocart',(req,res)=>{
        let token=req.headers.cookie.slice(0,-10)
        let cart_id=parseInt(jwt.verify(token,"kapil").customer_id)
        let product_id=parseInt(req.body.product_id)
        let item_id=parseInt(req.body.item_id)
        knex('save_cart').select("*").where({'cart_id':cart_id,'item_id':item_id})
        .then((data)=>{
            knex('shopping_cart').insert({'product_id':data[0].product_id,'cart_id':data[0].cart_id,'attributes':data[0].attributes,'attributes':data[0].attributes,'quantity':data[0].quantity,'added_on':data[0].added_on})
            .then(()=>{knex('save_cart').where({'item_id':item_id,'cart_id':cart_id}).del('*').then(()=>{res.send("successful add to cart")}).catch((err)=>{res.send(err)})})
        }).catch((err)=>{res.send(err)})
    })

    shoppingcart.get("/getsaved",(req,res)=>{
        let token=req.headers.cookie.slice(0,-10)
        let cart_id=parseInt(jwt.verify(token,"kapil").customer_id)
        knex('save_cart').select('product.name','save_cart.item_id','save_cart.attributes','product.price')
        .join('product','save_cart.product_id','product.product_id')
        .where('cart_id',cart_id)
        .then((data)=>{res.send(data)})
        .catch((err)=>{res.send(err)})
    })

}