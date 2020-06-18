const express = require('express');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const indexRouter = require('./routes/indexRoute.js');
const loginRouter = require('./routes/loginRoute.js');
const userRouter = require('./routes/userRoute.js');
const friendRouter = require('./routes/friendRoute.js');
const User = require('./schema/user.js');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const app = express();

const uri = 'mongodb+srv://roman:20051989@cluster0-vnual.mongodb.net/Sigma?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

app.set('views', './public');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.static('dist'));
app.use(cookieParser());
app.use(express.json()) ;
app.use(express.urlencoded({ extended: false }));
app.use(session({
  cookie: { maxAge: 3600000 },
  secret: 'codeworkrsecret',
  saveUninitialized: true,
  resave: false
}));


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ login: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
       user.comparePassword(password, function(err, isMatch) {
         if (err) throw err;
         if (!isMatch) {
           return done(null, false);
         }
         return done(null, user);
       });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err
      ? done(err)
      : done(null,user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/friend', friendRouter);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!');
})
