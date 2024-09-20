var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
// var logger = require('morgan');
var mongoose = require("mongoose");

var AppViecLamTheoGio = express();

function configureApp(app) {
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");
  // app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static("../storage"));
  app.use(cors());

  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
}

function errorApp(app) {
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
}

// Cấu hình App Viec lam theo gio
configureApp(AppViecLamTheoGio);
var VLTGRouter = require("./routes/vieclamtheogio");
AppViecLamTheoGio.use("/api/vltg", VLTGRouter);
errorApp(AppViecLamTheoGio);

const DB_URL = "mongodb://127.0.0.1:27017/vltg";
// const DB_URL = 'mongodb://localhost:27017'
mongoose
  .connect(DB_URL)
  .then(() => console.log("DB Connected!"))
  .catch((error) => console.log("DB connection error:", error.message));

// Viec lam theo gio
AppViecLamTheoGio.listen(3011, () => {
  console.log(`Viec lam theo gio app is running on port 3011`);
});

AppViecLamTheoGio.on("error", (error) => {
  console.error(
    "Error occurred while listening on viec lam theo gio port:",
    error
  );
});
