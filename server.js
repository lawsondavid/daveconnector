const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB Config
const db = require('./config/keys').mongoURI;
//connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch((e) => console.log(`Error connecting to mongo ${e}`));

// Passport middleware
app.use(passport.initialize());
//Passport config
require('./config/passport')(passport);

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


app.listen(port, () => console.log(`Server running on ${port}`));