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
const dashboardRoutes = require('./routes/dashboard.routes.js');
const graphVisualizationRoutes = require('./routes/graphVisualization.routes.js');
const learningModeRoutes = require('./routes/learningMode.routes.js');
const codeExecutionRoutes = require('./routes/codeExecution.routes.js');
const exerciseRoutes = require('./routes/exercise-routes.js');
const promptRoutes = require('./routes/prompt.routes.js');


app.use(express.static('html_files'));
app.use('/content_html_files', express.static(path.join(__dirname, './resources/content_html_files')));
app.use('/exercise_html_files', express.static(path.join(__dirname, './resources/exercise_html_files')));
app.use('/image', express.static(path.join(__dirname, './resources/image')));
app.use('/videos', express.static(path.join(__dirname, './resources/videos')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
}));


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
app.use(loginRoutes)
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

