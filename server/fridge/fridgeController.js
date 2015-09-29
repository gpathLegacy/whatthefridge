module.exports = function(Fridge) {
  return {
    getFridge: function(req, res) {
      Fridge.getFridgeByUser(req.user.id).then(function(data) {
        console.log("Controller data: ", data);
        res.send(data);
      });
    }
  }
}