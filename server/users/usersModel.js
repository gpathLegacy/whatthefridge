module.exports = function(knex) {

  return {
    signupLocal: function(username, hashedPass) {
      return knex('users').insert({
        'username': username,
        'password': hashedPass,
      });
    },

    getUserByName: function(username){
      return knex('users')
        .where({'username':username})
        .select();
    },

    getUserById: function(id){
      return knex('users')
        .where({'id':id})
        .select();
    }
  }   
};
