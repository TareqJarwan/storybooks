const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyPasrer = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');

// Load User Model
require('./models/User');
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Load Keys
const keys = require('./config/keys');

// Handlbars Helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/handlebars');

// Map globle promises
mongoose.Promise = global.Promise;

// Mongooes connect
mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB conected'))
    .catch(err => console.log(err));

const app = express();


// Body-Parser Middleware
app.use(bodyPasrer.urlencoded({
    extended: false
}));
app.use(bodyPasrer.json());

// Method-Override middleware
app.use(methodOverride('_method'));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Express Session middleware
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Globle Variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server started on ${port}`);
});