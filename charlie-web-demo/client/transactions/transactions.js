import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TransactionService } from '../services/transaction-service.js';

const DUMMY_USER_ID = "9999";

var load;
var searchDelayTimer;
var lastSearch;

function _load(searchString) {
  
  if (lastSearch === searchString) {
    return;
  }
  
  lastSearch = searchString;
  var self = this;
  var params = {"search_string" : searchString || ""};
  TransactionService.getTransactions(DUMMY_USER_ID, params).then(function(data) {
    self.responseData.set(data);
  }).catch(function(error) {
    alert(error);
  })
}

Template.transactions.onCreated(function onCreated() {
  this.responseData = new ReactiveVar(0);
  load = _load.bind(this);
  load('');
});

Template.transactions.helpers({

  data() {
    return Template.instance().responseData.get();
  }
});

Template.transactions.events({

  'keyup #transaction-search': function(event) {
    event.preventDefault();
    var searchString = $(event.currentTarget).val();
    clearTimeout(searchDelayTimer);
    searchDelayTimer = setTimeout(function() {
      load(searchString);
    }, 350);
  }

});

Template.transaction.events({

  'click .transaction': function(event) {
    event.preventDefault();
    //alert(this.id)
  },

  'click .name a': function(event) {
    event.preventDefault();
    $('#transaction-search').val(this.name);
    load(this.name);
  }
});