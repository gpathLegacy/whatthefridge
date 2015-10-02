module.exports = function(knex) {

  return {
    signup: function(newUser) {
      return knex('users').returning('id').insert(newUser);
    },

    getUserByName: function(username){
      return knex('users')
        .where({'username':username})
        .select();
    },

    getUserById: function(id, type){
      // If no type is specified, they want the user by row ID
      if (type === undefined) {
        return knex('users')
          .where({'id':id})
          .select();
      }
      // If a type is specified, they want the user by a social media ID
      // e.g. type = "twitter", they want to check row "twitter_id"
      type = type.concat("_id");
      return knex('users')
        .where(type, id)
        .select();
    },

    // The below method is used in unit tests only.
    deleteUser: function(id) {
      return knex('users')
        .where("id", id)
        .del();
    }
  }   
};
