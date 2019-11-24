module.exports=(product,knex,jwt,secret_key)=>{
    product.get("/",(req,res)=>{
        knex
        .select("*")
        .from("product")
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    product.get("/search",(req,res)=>{
        let body=req.query.pro;
        knex('product')
        .select("*")
        .where('name', 'like', '%'+ body)
        .then((data)=>{
            // console.log("data fatched")
            res.send(data)
        }).catch((err)=>{
            console.log("err")
            res.send(err)
        })
    })

    product.get("/:p_id",(req,res)=>{
        knex.select('*')
        .from('product')
        .where('product_id',req.params.p_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })

    product.get('/inCategory/:c_id',(req,res)=>{
        knex.select('product.product_id','name','description','price','discounted_price','thumbnail')
        .from('product')
        .join('product_category','product.product_id', '=' ,'product_category.product_id')
        .where('category_id',req.params.c_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    product.get("/inDepartment/:d_id",(req,res)=>{
        knex.select('product.name','product.product_id','product.description','price','discounted_price','thumbnail')
        .from('product')
        .join('product_category','product_category.product_id','=','product.product_id')
        .join('category','category.category_id' , '=' , 'product_category.category_id')
        .where('department_id',req.params.d_id)
        .then((data)=>{
            console.log("data fatched")
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    product.get('/:p_id/details',(req,res)=>{
        knex.select('*')
        .from('product')
        .where('product_id',req.params.p_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    product.get('/:p_id/locations',(req,res)=>{
        knex.select('category.name as category_name','department.name as department_name','department.department_id','category.category_id')
        .from('category')
        .join('product_category','product_category.category_id','=','category.category_id')
        .join('department','category.department_id','=','department.department_id')
        .where('product_id',req.params.p_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


    product.post('/reviews',(req,res)=>{
        let review=req.body.review;
        let rating=parseInt(req.body.rating)
        let product_id=parseInt(req.body.product_id)
        let token=req.headers.cookie.slice(0,-10)
        let customer_id=jwt.verify(token,'kapil').customer_id
        knex('review')
        .select('*')
        .where({"customer_id":customer_id,'product_id':product_id})
        .then((data)=>{
            if ((data.length)==0){
                knex('review')
                .insert({
                    "created_on":new Date,
                    'rating':rating,
                    'review':review,
                    'product_id':product_id,
                    'customer_id':customer_id
                })
                .then(()=>{res.send("review inserted")})
                .catch((err)=>{res.send(err)})
            }else{
                knex('review')
                .update({
                    'review':review,'rating':rating
                    })
                .where({"customer_id":customer_id,'product_id':product_id})
                .then(()=>{res.send("review apdated")})
                .catch((err)=>{res.send(err)})
            }
        }).catch((err)=>{res.send(err)})
    })
    
    product.get('/:product_id/reviews',(req,res)=>{
        knex("review")
        .select('product_id','rating','review','created_on','name')
        .join('customer','customer.customer_id','review.customer_id')
        .then((data)=>{res.send(data)})
        .catch((err)=>{res.send(err)})
    })
}
