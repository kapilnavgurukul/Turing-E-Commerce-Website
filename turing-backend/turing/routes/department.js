module.exports=(department,knex)=>{
    department.get("/",(req,res)=>{
        knex()
        .select("*")
        .from("department")
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    department.get("/:id",(req,res)=>{
        var id=req.params.id;
        knex
        .select("*")
        .from("department")
        .where("department_id",id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    
}