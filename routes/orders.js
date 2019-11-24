module.exports=(orders,knex,jwt,secret_key)=>{
    orders.post("/",(req,res)=>{
        let cart_id=req.headers.cookie.slice(0,-10);
        cart_id=jwt.verify(cart_id,secret_key).customer_id
        let ship_id=parseInt(req.body.shipping_id)
        let tax_id=parseInt(req.body.tax_id)
        let date =new Date
        console.log(date)
        knex('shopping_cart')
        .select('*')
        .where('cart_id',cart_id)
        .join('product','shopping_cart.product_id','product.product_id')
        .then((data)=>{
            let total_amount=0
            for (i of data){total_amount+=i.price*i.quantity}
            knex('shipping')
            .select('shipping_cost')
            .where('shipping_id',ship_id)
            .then((ship_data)=>{
                total_amount+=(ship_data[0].shipping_cost)
                console.log(total_amount)
                knex('tax')
                .select('*')
                .where('tax_id',tax_id)
                .then((tax_data)=>{
                    let tax_percentage=tax_data[0].tax_percentage
                    let tax=(tax_percentage*total_amount)/100
                    total_amount+=tax
                    knex('orders')
                    .insert({
                        'total_amount':total_amount,
                        'created_on':date,
                        'shipping_id':ship_id,
                        'tax_id':tax_id,'status':1,
                        'customer_id':cart_id})
                    .then(()=>{
                        knex('shopping_cart')
                        .update({'buy_now':0})
                        .where('cart_id',cart_id)
                        .then(()=>{
                            res.send("order done")
                        })
                        .catch((err)=>{res.send(err)})
                    })
                    .catch((err)=>{res.send(err)})
                })
                .catch((err)=>{res.send(err)})
            })
            .catch((err)=>{res.send(err)})
        })
        .catch((err)=>{res.send(err)})
    })


    
}
