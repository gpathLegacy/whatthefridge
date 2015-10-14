module.exports = function(Ingredients) {
  return {

    getPrice: function(req, res) {
      Ingredients.getIngredientByName(req.user.id, req.body.name).then(function(ingredient) {
        console.log(ingredient)
        res.send(ingredient[0].price);
      });
    },

    setPrice: function(req, res) {
      Ingredients.setIngredientPrice(req.user.id, req.body.name, req.body.price).then(function(ingredient) {
        res.send(200);
      });
    },

    productLookup: function(req, res) {
      //GET request to the semantics API
      //GET https:api.semantics3.com/v1/products?q={"MANDATORY_QUERY_FIELD1":"QUERY_VALUE1","OPTIONAL_FILTER_FIELD1":"FILTER_VALUE1"}
      
    }

  };
};