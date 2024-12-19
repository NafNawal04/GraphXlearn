const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const signupRoutes = require('./routes/signup.routes.js');
const loginRoutes = require('./routes/login.routes.js');
const logoutRoutes = require('./routes/logout.routes.js');
const dashboardRoutes = require('./routes/dashboard.routes.js');
const graphVisualizationRoutes = require('./routes/graphVisualization.routes.js');
const learningModeRoutes = require('./routes/learningMode.routes.js');
const codeExecutionRoutes = require('./routes/codeExecution.routes.js');
const exerciseRoutes = require('./routes/exercise.routes.js');
const promptRoutes = require('./routes/prompt.routes.js');


app.use(express.static('html_files'));

app.use(express.static(path.join(__dirname)));
app.use('/content_html_files', express.static(path.join(__dirname, './resources/content_html_files')));
app.use('/exercise_html_files', express.static(path.join(__dirname, './resources/exercise_html_files')));
app.use('/image', express.static(path.join(__dirname, './resources/image')));
app.use('/videos', express.static(path.join(__dirname, './resources/videos')));
app.use('/styles', express.static(path.join(__dirname, './resources/styles')));
app.use(express.static(path.join(__dirname)));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,

    
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await db.user.findUnique({
      where: { email: profile.emails[0].value }
    });

    if (!user) {
      // New user - create entry in the database
      const newUser = await db.user.create({
        data: {
          name: profile.displayName,
          email: profile.emails[0].value,
          password: null,
        }
      });

      // Mark as a new user
      newUser.isNewUser = true; 
      return done(null, newUser);
    }

    // Existing user
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));


passport.serializeUser((user, done) => {
  console.log("Serializing user:", user); 
  done(null, user.email); // 
});

passport.deserializeUser(async (email, done) => {
  console.log("Deserializing email:", email); 
  try {
    const user = await db.user.findUnique({ where: { email } });
    console.log("Deserialized user:", user); 
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    if (req.user) {
      req.session.isAuthenticated = true;

      if (req.user.isNewUser) {
        // Redirect new users to the sign-up page
        res.redirect('/signup'); // Replace with your sign-up route or onboarding flow
      } else {
        // Existing users go to the dashboard
        res.redirect('/dashboard');
      }
    } else {
      res.redirect('/login');
    }
  }
);



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './resources/html_files', 'landing.html'));
});


app.get("/api/exercise/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const exercise = await prisma.exercise.findUnique({
        where: { id },
      });
  
      if (exercise) {
        res.json(exercise);
      } else {
        res.status(404).json({ message: "Exercise not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });



function ensureAuthenticated(req, res, next) {
    const publicPaths = ['/', '/login', '/signup'];
    if (publicPaths.includes(req.path) || req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
}

app.use(ensureAuthenticated);


app.use(signupRoutes);
app.use(loginRoutes);
app.use(logoutRoutes);
app.use(dashboardRoutes);
app.use(graphVisualizationRoutes);
app.use(learningModeRoutes);
app.use(codeExecutionRoutes);
app.use(exerciseRoutes);
app.use(promptRoutes);


const port = 3000;
app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});

