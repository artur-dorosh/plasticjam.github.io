const db = require("../models");
const mongoose = require("mongoose");
const User = db.users;
const Statistic = db.statistics;

var moment = require('moment');

exports.findAllUsers = (req, res) => {
  let page = req.query.page ? req.query.page : 0;
  let range = req.query.range ? req.query.range : 5;

  let body = {
    "content": [],
    "totalPages": '',
    "totalElements": ''
  };

  User.find({})
    .then(data => {
      body.totalElements = data.length;
      body.totalPages = Math.ceil(data.length / range);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });

  User.find({ $and: [ {number: { $gt: (+page - 1) * +range }}, {number: { $lt: ((+page - 1) * +range) + (+range + 1) }} ]})
    .then(data => {
      body.content = data;

      res.send(body);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

exports.findStatistic = (req, res) => {
  let userId = req.query.id ? req.query.id : '';
  let from = req.query.from ? moment(req.query.from) : moment().subtract(7,'days');
  let until = req.query.to ? moment(req.query.to) : moment();

  let length = moment(until).diff(from, 'days');

  let body = [];
  for (let i = 0; i <= length; i++) {
    body.push({
      "_id": mongoose.Types.ObjectId(),
      "page_views": 0,
      "date": moment(from).add(i, 'days').add(3, 'hours'),
      "clicks": 0,
      "userId": userId
    })
  }

  Statistic.find({$and: [ {date: { $gte: from}}, {date: { $lte: until}}, {userId: userId} ]})
    .then(data => {
      data.map(dataItem =>
        body.map(bodyItem => {
          if (dataItem.date.getDate() === bodyItem.date.date() && dataItem.date.getMonth() === bodyItem.date.month()) {
            bodyItem.clicks = dataItem.clicks;
            bodyItem['page_views'] = dataItem['page_views'];
          }
        })
      );

      res.send(body);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user statistic."
      });
    });
};
