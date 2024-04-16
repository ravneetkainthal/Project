const User = require('../models/user');
const jwt=require('jsonwebtoken');




// Handle errors
const handleErrors = (err) => {
    let errors = {
        email: '',
        password: ''
    };
    //duplicate error code
    if (err.code === 11000){
        errors.email='Email already registered!';
        return errors;
    }

    // Validation error
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message; // Assign error message to the respective field in the errors object
        });
    }

    return errors;
}


//tokens
const maxAge=5*24*60*60;
const createToken= (id)=>{

    return jwt.sign({id},'project secret',{
        expiresIn: maxAge       //valid for how long
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = (req, res) => {
    const { email, password } = req.body;

    User.create({ email, password })
        .then(user => {
            const token = createToken(user._id);
            // Place token under cookie and send it
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(201).json({ user: user._id });
        })
        .catch(err => {
            console.error(err); // Log the error
            const errors = handleErrors(err);
            res.status(400).json({ errors }); // Send the error messages in JSON response
        });
};


module.exports.login_post = (req, res) => {
    const { email, password } = req.body;
    User.login(email, password)
        .then(user => {
            const token = createToken(user._id);
            // Place token under cookie and send it
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
            res.status(200).json({ user: user._id });
        })
        .catch(err => {
            const errors= handleErrors(err);
            res.status(400).json({ errors: err.message });
        });
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
