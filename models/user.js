var mongoose = require('mongoose'),
    crypto = require('crypto'),
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
              lowercase: true,
            },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  hashedPassword: String,
  salt: String
});

/**
 * Virtuals
 */
userSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });


/**
 * Pre-save hook
 */
userSchema
  .pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });



/**
 * Methods
 */
userSchema.methods = {

    /**
   * Authenticate - check if the passwords are the same
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }

};

var validatePresenceOf = function (value) {
  return value && value.length;
};


module.exports = mongoose.model('User', userSchema);
