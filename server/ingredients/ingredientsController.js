module.exports = function(Ingredients) {
  return {

    getPrice: function(req, res) {
      Ingredients.getIngredientByName(req.body.name).then(function(ingredient) {
        res.send(ingredient[0].price);
      });
    },

    setPrice: function(req, res) {
      console.log(req.body)
      Ingredients.setIngredientPrice(req.body.name, req.body.price).then(function(ingredient) {
        res.send(200);
      });
    }

  };
};