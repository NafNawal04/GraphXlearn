const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const signupRoutes = require('./routes/signup.routes');
const loginRoutes = require('./routes/login.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

app.use(express.static('html_files'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
}));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'html_files', 'landing.html'));
});

app.use(signupRoutes);
app.use(loginRoutes)
app.use(dashboardRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});

