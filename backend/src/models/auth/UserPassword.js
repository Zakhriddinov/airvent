const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminPasswordSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  emailToken: String,
  emailTokenExpires: Date,
  resetToken: String,
  verificationCode: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  authType: {
    type: String,
    default: 'email',
  },
  loggedSessions: {
    type: [String],
    default: [],
  }
});

// AdminPasswordSchema.methods.validPassword = function (password) {
//   return bcrypt.compareSync(password, this.password);
// };

module.exports = mongoose.model('UserPassword', AdminPasswordSchema);
