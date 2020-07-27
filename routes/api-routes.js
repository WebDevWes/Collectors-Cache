// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const { Sequelize } = require("../models");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        username: req.user.username,
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // Refers to /models/card.js to create new card, takes in post request from members.js
  app.post("/api/cards", (req, res) => {

    db.Card.create(req.body).then(dbCard => res.json(dbCard))

  })

  // Refers to /models/card.js to grab all card, get request from members.js
  app.get("/api/cards/:id/", (req, res) => {

    db.Card.findAll({
      where: {UserID: req.params.id}
    }).then(data => res.json(data))

  })

  // Refers to /models/card.js to grab queried card, get request from members.js
  app.get("/api/cards/:id/:query", (req, res) => {

    db.Card.findAll({
      where: {name:{[Sequelize.Op.like]:'%' + req.params.query + '%'}, UserID: req.params.id}
    }).then(data => res.json(data))

  })

  // Refers to /models/card.js to grab the card associatied with the button that triggers the event
  // get request from members.js, to delete the card
  app.delete("/api/cards/:id", function(req, res){
    db.Card.destroy({
      where: {
        id:req.params.id
      }
    }).then(data => res.json(data))
  })
  

};

