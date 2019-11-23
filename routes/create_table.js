module.exports = (knex)=>{
    knex.schema.hasTable('save_cart').then((exists)=>{
        if (!exists) {
          return knex.schema.createTable('save_cart',(t)=>{
            t.increments('item_id').primary();
            t.string('product_id', 100);
            t.string('customer_id', 100);
            t.string('attributes',100);
          });
        }
      });
}