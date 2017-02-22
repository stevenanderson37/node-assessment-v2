var app = require('./server');
var accounts = require('./accounts.json');
var _ = require('lodash');

module.exports = {

  readAll: function(req, res, next) {
    var filteredAccounts;

    if (req.query.cardtype) {
      filteredAccounts = accounts.filter(function (value) {
        return value.card_type.toLowerCase() === req.query.cardtype.toLowerCase();
      });
    } else if (req.query.firstname) {
      filteredAccounts = accounts.filter(function (value) {
        return value.first_name.toLowerCase() === req.query.firstname.toLowerCase();
      });
    } else if (req.query.lastname) {
      filteredAccounts = accounts.filter(function (value) {
        return value.last_name.toLowerCase() === req.query.lastname.toLowerCase();
      });
    } else if (req.query.balance) {
      filteredAccounts = accounts.filter(function (value) {
        return value.balance === req.query.balance;
      });
    } else if (req.query.state) {
      filteredAccounts = accounts.filter(function (value) {
        for(var i = 0; i < value.approved_states.length; i++) {
          if (value.approved_states[i].toLowerCase() === req.query.state.toLowerCase()) {
            return value.approved_states;
          }
        }
      });
    } else {
      filteredAccounts = accounts;
    }

    if (req.params.filter && !isNaN(req.params.filter) && filteredAccounts.length <= 0) {
      res.status(404).send('account could not be found');
    } else {
      res.status(200).send(filteredAccounts);
    }
  },

  findAccountById: function(req, res, next) {
    var accountId = req.params.accountId;
    var account = [];

    for(var i = 0; i < accounts.length; i++) {
      if (accounts[i].id == accountId) {
        account.push(accounts[i]);
      }
    }

    if (account.length <= 0) {
      res.status(404).send('account could not be found');
    } else {
      res.status(200).send(account);
    }
  },

  createAccount: function(req, res, next) {
    function genId() {
      return _.last(accounts).id + 1;
    }

    var account = _.assign({}, account, {id: genId(), card_number: req.body.card_number, card_type: req.body.card_type, balance: req.body.balance, first_name: req.body.first_name, last_name: req.body.last_name, approved_states: [req.body.approved_states]});

    accounts.push(account);

  	res.status(200)
			.send(account);
  },

  updateAccount: function(req, res, next) {
    var updatedAccount;

    for(var i = accounts.length-1; i >= 0; i--) {
      if (accounts[i].id == req.params.accountId) {
        for (var j in req.body) {
          accounts[i][j] = req.body[j];
        }
        updatedAccount = accounts[i];
      }
    }

    res.status(200).send(updatedAccount);
  },

  updateCard: function(req, res, next) {
    var updatedAccount;

    for(var i = accounts.length-1; i >= 0; i--) {
      if (accounts[i].id == req.params.accountId) {
        accounts[i].card_type = req.body.card_type;
        updatedAccount = accounts[i];
      }
    }

    res.status(200).send(updatedAccount);
  },

  addState: function(req, res, next) {
    // var newState = req.body.add;
    var updatedAccount = [];
    for(var i = accounts.length-1; i >= 0; i--) {
      if (accounts[i].id == req.params.accountId) {
        accounts[i].approved_states.push(req.body.add);
        updatedAccount.push(accounts[i]);
      }
    }

    if (updatedAccount.length <= 0) {
      res.status(500).send('error');
    } else {
      res.status(200).send(updatedAccount);
    }
  },

  removeState: function(req, res, next) {

    var deletedState;
    for(var i = accounts.length-1; i >= 0; i--) {
      if (accounts[i].id == req.params.id) {
        for(var j = 0; j < accounts[i].approved_states.length; j++) {
          if (accounts[i].approved_states[j].toLowerCase() === req.query.state.toLowerCase()) {
            accounts[i].approved_states.splice(j, 1);
          }
        }
        deletedState = accounts[i];
      }
    }

    res.status(200).send(deletedState);
  },

  removeAccount: function(req, res, next) {
    var deletedAccount = [];

    for(var i = accounts.length-1; i >= 0; i--) {
      if (accounts[i].id == req.params.accountId) {
        deletedAccount.push(accounts[i]);
        accounts.splice(i, 1);
      }
    }

    if (deletedAccount.length <= 0) {
      res.status(404).send('account could not be found');
    } else {
      res.status(200).send(deletedAccount);
    }
  }

}
