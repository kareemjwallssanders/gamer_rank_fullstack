module.exports = function(app, passport, db, multer, ObjectId) {

//---------------------------------------
// IMAGE CODE
//---------------------------------------
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images/uploads')
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + ".png")
  }
})
var upload = multer({storage: storage})
//---------------------------------------
// IMAGE CODE END
//---------------------------------------

// pages =========================================================================

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // after the user is redirected to their profile,
  // the user will be able to upload an image and a name
  app.get('/profile', isLoggedIn, async function(req, res) {
    db.collection('rankings').find().sort({winStreak:-1}).limit(10).toArray((err, rankings) => {
      if (err) return console.log(err)
      db.collection('users').find().toArray((err, users) => {
        if (err) return console.log(err)
        res.render('profile.ejs', {
          rankings: rankings,
          users: users,
          user: req.user
        })
      })
    })
  });

  app.get('/game', isLoggedIn, function(req, res) {
    res.render('game.ejs', {
      user: req.user
    })
  }); 

// api ===========================================================================

  app.post('/api/rankings', (req, res) =>{
    db.collection('rankings').save({userId: ObjectId(req.body.userId), winStreak: req.body.winStreak}, (err, result) => {
      if (err) return console.log(err)
      res.send(result)
    })
  })

  app.post('/api/profile_pic', upload.single('avatar'), (req, res) => {
    db.collection('users').findOneAndUpdate({_id: ObjectId(req.body._id)}, {
      $set: {
        "local.avatar": '/images/uploads/' + req.file.filename
      }
    }, {
      sort: {_id: -1},
      upsert: false
    }, (err, result) => {
      if (err) return res.send(err)
      res.redirect('/profile')
    })
  })

// =============================================================================
// login/signup ================================================================
// =============================================================================

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', upload.single('avatar'), passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/owner');
    });
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }
}
