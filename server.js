var express = require('express');
var bodyParser = require('body-parser');
var accountsCtrl = require('./accountsCtrl');

var app = express();
app.use(bodyParser.json());

app.get('/api/accounts', accountsCtrl.readAll);
app.get('/api/accounts/:accountId', accountsCtrl.findAccountById);
app.get('/api/accounts/:filter', accountsCtrl.readAll);
app.post('/api/accounts', accountsCtrl.createAccount);
app.post('/api/accounts/cardtype/:accountId', accountsCtrl.updateCard);
app.post('/api/accounts/approvedstates/:accountId', accountsCtrl.addState);
app.put('/api/accounts/:accountId', accountsCtrl.updateAccount);
app.delete('/api/accounts/approvedstates/:accountId/', accountsCtrl.removeState);
app.delete('/api/accounts/:accountId', accountsCtrl.removeAccount);


var port = 3000;
app.listen(port, function(){
    console.log('listening on ' + port);
})

// module.exports = app;
