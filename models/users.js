const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

const usersSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  tasks: Array
})

usersSchema.plugin(passportLocalMongoose)

let Users = mongoose.model('Users', usersSchema);
module.exports = Users;
