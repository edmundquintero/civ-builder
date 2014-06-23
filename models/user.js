var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
              type: String,
              required: true,
              unique: true,
              lowercase: true
            },
  email:    {
              type: String,
              required: true,
              unique: true,
              lowercase: true
            },
  password: {
              type: String,
              required: true
            },
  hashedPassword: String,
  salt: String
});

/**
 * Virtuals
 */
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });



userSchema.methods.validPassword = function(candidatePassword) {
  if(this.password === candidatePassword){
    return true;
  } else {
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
