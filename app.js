/**
 * @author Ahmad Fathon Nurhidayat <fathon626@gmail.com>
 * @license MIT
 * @app Inventory-app
*/

// Deklarasi Module

const express           = require('express');
const bodyParser        = require('body-parser');
const flash             = require('connect-flash');
const ejs               = require('ejs');
const cookieParser      = require("cookie-parser");
const session           = require("express-session");

// connect to app

const app = express();
const port = process.env.PORT || 8000

// connect to Mongo DB
require("./utils/db");
const inventoris = require("./model/inventori");

// view engine

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: true
}));

//Bootstrap
app.use('/css', express.static('node_modules/bootstrap/dist/css'));
app.use('/js', express.static('node_modules/bootstrap/dist/js'));


// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

let sess;

function checkUserSession(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.flash("msg", "Anda harus login terlebih dahulu!");
    res.redirect('/');
  }
} 

// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 

// login page sekaligus ngecek

app.get("/", function (req, res) {
    sess = req.session;
    if (sess.loggedin) {
      return res.redirect("/dashboard");
    }
    if (req.query.logout) {
      req.flash("logout", "Anda telah logout!");
      return res.redirect('/');
    }
    res.render("login", {
        title : 'Login | faton - App',
      belumLogin: req.flash("msg"),
      logout: req.flash('logout')
    });
});

// cek login

app.post("/", (req, res) => {
    sess = req.session;
    const username = req.body.username;
    const password = req.body.password;
  
    if (username !== 'fathon' && password !== 'admin1234') {
      req.flash("msg", "Username & Password salah!");
      res.render("login", {
          title: 'Login | Faton - App',
        msg: req.flash("msg"),
      });
    } else {
      if (username === "fathon") {
        if (password === "admin1234") {
          sess.username = username;
          sess.password = password;
          sess.loggedin = true;
          req.flash("msg", "Anda telah login!");
          res.redirect("/dashboard");
        } else {
          req.flash("msg", "Password salah!");
          res.render("login", {
            msg: req.flash("msg"),
          });
        }
      } else {
        console.log("Username salah");
        req.flash("msg", "Username salah!");
        res.render("login", {
          msg: req.flash("msg"),
        });
      }
    }
  });

// dashboard page

  app.get("/dashboard", checkUserSession, async (req, res) => {
    sess = req.session;
    sess.loggedin = true;
    res.render("dashboard",{
      logout: req.flash("msg"),
      title: "dashboard | Faton - App",
      loggedin: sess.loggedin
    });
  });


  // About

  app.get("/about", checkUserSession, async (req, res) => {
    sess = req.session;
    sess.loggedin = true;
    res.render("about",{
      logout: req.flash("msg"),
      title: "dashboard | Faton - App",
      loggedin: sess.loggedin
    });
  });


// Tampil Data Inventori

app.get("/inventori", checkUserSession, async (req, res) => {
  sess = req.session;
  const inventori = await inventoris.find();
  sess.loggedin = true;
  res.render("inventori", {
    inventori,
    msg: req.flash("msg"),
    title: "Inventory | Faton App",
    loggedin: sess.loggedin
  });
});

// Tambah Data
app.post("/inventori", (req, res) => {
  sess = req.session;
  inventoris.insertMany(req.body, (error, result) => {
    req.flash("logout", "Data berhasil ditambah!");
    sess.loggedin = true;
    res.redirect("/inventori");
  });
});

// Cek Tambah
app.get("/add", checkUserSession, (req, res) => {
  sess = req.session;
  sess.loggedin = true;
  res.render("add", {
    title: "Tambah Data | Faton App"
  });
});



// Hapus Data
app.get("/hapus/:kode", async (req, res) => {
  const inventori = await inventoris.findOne({
    kode: req.params.kode
  });
  if (!inventori) {
    res.status(404);
    res.send("<h1>404</h4>");
  } else {
    inventori.deleteOne({
      _id: inventori._id
    }).then((result) => {
      req.flash("logout", "Data berhasil dihapus!");
      sess.loggedin = true;
      res.redirect("/inventori");
    });
  }
});

// Ubah Data Inventori
app.get("/ubah/:kode", checkUserSession, async (req, res) => {
  const inventori = await inventoris.findOne({
    kode: req.params.kode
  });
  console.log(inventori);
  res.render("ubah", {
    inventori,
    title: "Ubah Data | Faton - App"
  });
});



// Cek Ubah Data Inventori
app.post("/ubah/update", (req, res) => {
  inventoris.updateOne(
    {
      _id: req.body._id
    },
    {
      $set: {
        kode: req.body.kode,
        nama: req.body.nama,
        jumlah: req.body.jumlah,
        keterangan: req.body.keterangan,
      },
    }
  ).then((result) => {
      req.flash("logout", "Data berhasil diubah!");
      sess.loggedin = true;
      res.redirect("/inventori");
    });
});







// Logout
app.get("/logout", (req, res) => {
    res.redirect("/?logout=true");
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
    });
  });
  



// jalan di port
app.listen(port, function (err) {
    if (err) console.log(err);
    console.log("Server berjalan di http://localhost:8000");
  });