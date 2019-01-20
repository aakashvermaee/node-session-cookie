const port = 4000;

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const {
  json,
  urlencoded
} = require("body-parser");

const app = express();

app.use(json());
app.use(urlencoded({
  extended: false
}));

// SET secret at app-level
app.set("secret", "secret-secret");

app.use(session({
  secret: app.get("secret"),
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,
    expires: (new Date().getTime() * 86400000).toString()
  }
}));

app.use(cookieParser(app.get("secret")));

app.use((req, res, next) => {
  if (!req.session.cookie.user) {
    const user = {
      id: req.session.id
    }
    req.session.cookie.user = user;
    res.cookie("id", user.id);
    req.session.save((err) => {});
  }

  // if cookie has session-id
  if (req.cookies.id) {
    const sessionId = req.cookies.id;
    console.log(sessionId === req.session.id);
  }
  next();
});

app.get("/", (req, res) => {
  const id = req.session.cookie.user.email || req.body.email;
  id
  ? res.send({
    "session": true,
    "user": id
  })
  : res.send({
    "session": false,
    "user": req.session.cookie.user
  });
});

app.listen(port, (err) => {
  err ? console.log(err) : console.log(`App running on port: ${port}`);
});