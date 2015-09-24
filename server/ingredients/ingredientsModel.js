/* database models
exports model methods along with the connection object

*/


module.exports = function(knex) {
    return {
      //fetch ingredient details for an ingredient id
      getIngredient: function(userId) {
        return knex('')
          .
      },
      //for a new recipe, add ingredients sent by the recipes model
      addIngredient: function(name, price) {
        //version 1: receiving one ingredient at a time
        var price = price || 0;
        return knex('ingredients')
          .insert({
            'name': name,
            'price': price
          })
        //version 2: receiving multiple arguments and sending one promise back
        //var slicedIng = Array.prototype.slice.call(arguments, 1);
      }
      }
    }
}