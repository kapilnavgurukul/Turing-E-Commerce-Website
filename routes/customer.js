
module.exports=(customer,knex,jwt,secret_key)=>{
    customer.post('/',(req,res)=>{
        let body=req.body;
       knex('customer')
       .insert({name:req.body.name, email:req.body.email,password:req.body.password })
       .then(()=>{
           res.send("registration done")
       }).catch((err)=>{
           res.send(err)
       })
    })

    customer.post('/login',(req,res)=>{
        knex
        .select('*').from('customer').havingIn('customer.email',req.body.email)
        .then((data)=>{
            if (data.length==0){
                res.send("wrong email")
            }else{
                knex.select('customer_id','password')
                .from('customer')
                .where('email','=',req.body.email)
                .havingIn('customer.password',req.body.password)
                .then((data)=>{
                    if (data.length==0){
                        res.send("wrong password")
                    }else{
                        data=(JSON.stringify(data))
                        data=JSON.parse(data)
                        let id=data[0]['customer_id'].toString();
                        let token=jwt.sign({"customer_id":id},secret_key)
                        res.cookie(token)
                        res.send("log in successful")
                    }
                }).catch((err)=>{
                    res.send(err)
                })
            }
        }).catch((err)=>{
            res.send(err)
        })
    })

    customer.put('/',(req,res)=>{
        let token=req.headers.cookie.split(' ')
        token=token[token.length-1].slice(0,-10)
        token=jwt.verify(token,secret_key)
        knex('customer')
        .where('customer_id',token.customer_id)
        .update(
        {
        "name": req.body.name,
        "email":req.body.email,
        "password": req.body.password,
        "day_phone":req.body.day_phone,
        "eve_phone": req.body.eve_phone,
        "mob_phone": req.body.mob_phone
    })
        .then(()=>{
            res.send("done")
        }).catch((err)=>{
            res.send(err)
        })
    })


    customer.get("/",(req,res)=>{
        let token=req.headers.cookie.split(' ')
        token=token[token.length-1].slice(0,-10)
        token=jwt.verify(token,secret_key)
        knex
        .select('*')
        .from('customer')
        .where('customer_id',token.customer_id)
        .then((data)=>{
            delete data[0].password;
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    customer.put("/address",(req,res)=>{
        let token=req.headers.cookie.split(' ')
        token=token[token.length-1].slice(0,-10)
        token=jwt.verify(token,secret_key)
        knex('customer')
        .where('customer.customer_id',token.customer_id)
        .update({
            "address_1":req.body.address_1,
            "address_2":req.body.address_2,
            "city": req.body.city,
            "region":req.body.region,
            "postal_code":req.body.postal_code,
            "country":req.body.country,
            "shipping_region_id":req.body.shipping_region_id
        }).then(()=>{
            res.send("address updated")
        }).catch((err)=>{
            res.send(err)
        })
    })

    customer.put("/creditCard",(req,res)=>{
        let token=req.headers.cookie.split(' ')
        token=token[token.length-1].slice(0,-10)
        token=jwt.verify(token,'kapil')
        knex('customer')
        .where('customer.customer_id',token.customer_id)
        .update({
            "credit_card":req.body.credit_card
        }).then(()=>{
            res.send("credit_card updated")
        }).catch((err)=>{
            res.send(err)
        })
    })

    customer.post('/logout',(req,res)=>{
        cookies.set('testtoken', {expires: Date.now()});
        res.send("logout done")
    })
}



