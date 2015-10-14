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
    }
  };
};