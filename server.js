const express = require("express");
const cors =  require("cors");
const cookieSession = require("cookie-session");
const app = express();
const dbConfig = require("./app/config/db.config");

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
// set port, listen for requests

const db = require("./app/models");
const Role = db.role;
db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Succesfully connect to MongoDB");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

//  initial function helps us to create 3 important rows in roles collection.
function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });
            new Role ({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'moderator' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            })
        }
    })
}

var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));

// parse request of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded( { extended: true}));

// name: The name of the cookie to set, defaults to session.
// keys:
// secret :A string which will be used as single key if keys is not provided.
// httpOnly: a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default).
app.use(
    cookieSession({
        name: "vernandodev-session",
        secret: "COOKIE_SECRET",
        httpOnly: true
    })
);

// simple route will be create new folder for route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to app!"});
});

app.get("/product", (req, res) => {
    res.json({ message: "halaman product!"});
});

// set port, listen for request
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});