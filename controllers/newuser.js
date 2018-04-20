const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res) => {
  const newUser = new User({ // Get register data (POST Method)
    name: req.body.name,
    birthday: req.body.birthday,
    email: req.body.email,
    private: req.body.privacy === 'private' ? true : false,
    username: req.body.username,
    password: req.body.password
  })

  newUser.save((err, user) => { // Tries save the new user
    if (err) {
      res.render('error') // Render the error view (../views/error.ejs)
    } else {
      res.render('registered') // Render the registered view (../views/registered.ejs)
    }
  })
}
