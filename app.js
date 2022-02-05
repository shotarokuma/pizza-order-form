const express = require('express');
const validators = require('./validators');

const app = express();

const server = app.listen(8080, () => console.log(
  'listening '));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use("/",validators.colorFormValidator);

app.get("/", (req, res) => {
  res.render("index", { color: req.query.color });
});

app.use(validators.pizzaFormValidator);

app.post("/orders", (req, res) => {
  if (res.local != null) {
    res.render('error', { validationErrors: res.local })
  } else {
    res.render('success', { order: req.body });
  }
});
