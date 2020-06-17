module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.get("/", users.findAllUsers);

  router.get("/statistic", users.findStatistic);

  app.use('/task/api/v1/users', router);
};
