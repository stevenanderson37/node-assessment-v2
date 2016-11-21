var express = require('express');
var bodyParser = require('body-parser');
var accounts = require('./accounts.json');

var app = express();

app.use(bodyParser.json());



app.get('/api/accounts', function(req, res, next) {
  var result, query = req.query;
      if (query.cardtype) {
          result = accounts.filter(function(e) {
            return query.cardtype === e.card_type;
          });
          res.send(result);
      } else if (query.balance) {
          result = accounts.filter(function(e){
            return e.balance === query.balance;
          });
          res.send(result);
      } else if (query.firstname) {
        result = accounts.filter(function(e){
          return e.first_name.toLowerCase() === query.firstname.toLowerCase();
        });
        res.send(result);
      } else if (query.lastname) {
        result = accounts.filter(function(e){
          return e.last_name.toLowerCase() === query.lastname.toLowerCase();
        });
        res.send(result);
      } else {
          res.send(accounts);
      }
});

app.get('/api/accounts/:id', function(req, res, next) {
  var id = Number(req.params.id), flag;
  accounts.map(function(e, i) {
    if (e.id === id) {
      res.send(e);
      flag = true;
    }
  });
  if (!flag) res.sendStatus(404);
});

app.post('/api/accounts', function(req, res, next) {
  var states = [req.body.approved_states];
  accounts.push(req.body);
  accounts[accounts.length - 1].approved_states = states;
  accounts[accounts.length - 1].id = accounts.length;
  res.send(accounts[accounts.length - 1]);
});

app.post('/api/accounts/cardtype/:id', function(req, res, next) {
  var id = Number(req.params.id);
  var flag;
  accounts.map(function(e, i) {
    if (e.id === id) {
      e.card_type = req.body.card_type;
      res.send(e);
      flag = true;
    }
  });
  if (!flag) res.sendStatus(404);
});

app.post('/api/accounts/approvedstates/:accountId/', function(req, res, next) {
  var id  = Number(req.params.accountId), flag;
  accounts.map(function(e, i) {
    if (e.id === id) {
      e.approved_states.push(req.body.add);
      res.send(e);
      flag = true;
    }
  });
  if (!flag) res.sendStatus(404);
});

app.delete('/api/accounts/approvedstates/:accountId/', function(req, res, next) {
  var id = +req.params.accountId;
  accounts.map(function(e, i) {
    if (e.id === id) {
      e.approved_states.splice(accounts.indexOf(req.query.state), 1);
      res.send(e);
    }
  });
});

app.delete('/api/accounts/:id', function(req, res, next) {
  var id = +req.params.id;
  accounts.map(function(e, i) {
    if (e.id === id) {
      accounts.splice(i, 1);
      res.sendStatus(200);
    }
  });
});

app.put('/api/accounts/:id', function(req, res, next) {
  var id = +req.params.id;
  accounts.map(function(e, i) {
    if (e.id === id) {
      for(var key in req.body) {
        e[key] = req.body[key];
      }
      res.send(e);
    }
  });
});






app.listen(3000, function() {
    console.log('listening on 3000');
});

module.exports = app;
