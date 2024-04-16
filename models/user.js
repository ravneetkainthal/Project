const mongoose = require('mongoose');
const {isEmail}= require('validator');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

//schema

const userSchema = new mongoose.Schema({
     
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase:true,
        validate: [isEmail, 'Invalid Email Id']
         //validate: [(val)=>{ isEmail },'Invalid Email Id']  //custom validation function
    },
    password: {
        type: String,
        required: [true, 'Please enter an password']
    }
});

//hashing password nas saving to db
userSchema.pre('save', function(next) {
    bcrypt.genSalt()
      .then(salt => {
        return bcrypt.hash(this.password, salt);
      })
      .then(hashedPassword => {
        this.password = hashedPassword;
        next();
      })
      .catch(error => {
        next(error);
      });
  });



  //static method to login

  userSchema.statics.login = function (email, password) {
    return this.findOne({ email }).then(user => {
        if (user) {
            return bcrypt.compare(password, user.password).then(auth => {
                if (auth) {
                    return user;
                }
                throw Error('Incorrect Password!!');
            });
        }
        throw Error('Incorrect Email!!!');
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
