import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TransactionService } from '../services/transaction-service.js';

const DUMMY_USER_ID = "9999";

Template.transactions.onCreated(function onCreated() {
  this.response = new ReactiveVar(0);
  var self = this;
  TransactionService.getTransactions(DUMMY_USER_ID).then(function(data) {
    self.response.set(data);
  }).catch(function(error) {
    alert(error);
  })
});

Template.transactions.helpers({

  response() {
    return Template.instance().response.get();
  }
});

Template.transactions.events({

});