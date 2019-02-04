var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Photo      = require("./models/photo"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds")

mongoose.connect('mongodb://localhost:27017/my_photos', { useNewUrlParser: true });
app.locals.moment = require("moment");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

//seedDB();

var commentRoutes = require("./routes/comments"),
    photoRoutes   = require("./routes/photos"),
    indexRoutes   = require("./routes/index")

//Passport Configuration
app.use(require("express-session")({
    secret: "Photo",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Record currentUser for each template
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use("/", indexRoutes);
app.use("/photos", photoRoutes);
app.use("/photos/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Starting!!!");  
});