module.exports=(attributes,knex)=>{
    attributes.get("/",(req,res)=>{
        knex
        .select("*")
        .from("attribute")
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    attributes.get("/:a_id",(req,res)=>{
        knex
        .select("*")
        .from("attribute")
        .where("attribute_id",req.params.a_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    attributes.get("/values/:id",(req,res)=>{
        knex
        .select("attribute_value_id","value")
        .from("attribute_value")
        .where("attribute_id",req.params.id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


    attributes.get("/inproduct/:p_id",(req,res)=>{
        knex
        .select('attribute_value.attribute_value_id','name as attribute_name','value as attribute_value')
        .from('attribute_value')
        .join('product_attribute',"attribute_value.attribute_value_id",'product_attribute.attribute_value_id')
        .join('attribute',"attribute.attribute_id","attribute_value.attribute_id")
        .where('product_id',req.params.p_id)
        .then((data)=>{
            console.log("kkkkaplu")
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })
}