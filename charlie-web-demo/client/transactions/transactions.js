import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TransactionService } from '../services/transaction-service.js';

const DUMMY_USER_ID = "9999";

var load;
var searchDelayTimer;
var lastSearch;
var selectedTransaction = new ReactiveVar();
var searchText = new ReactiveVar("");

function _load() {
  
  var searchString = searchText.get();
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
  load();
});

Template.transactions.helpers({

  data: function() {
    return Template.instance().responseData.get();
  },

  searchText: function() {
    return searchText.get();
  },

  transactionsForDate: function(date) {
    var data = Template.instance().responseData.get();
    return data.dateMap[date];
  },

  sumForDate: function(date) {
    var data = Template.instance().responseData.get();
    var sum = 0;
    data.dateMap[date].forEach(function(txn) {
      sum += txn.amount;
    });
    return sum;
  },

  selectedTransaction: function() {
    return selectedTransaction.get();
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
    event.stopImmediatePropagation();
    selectedTransaction.set(this);
  },

  'click .name a': function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    searchText.set(this.name);
    load();
  }
});

Template.transactionDetails.events({

  'click #back': function() {
    $('#transaction-search').val(this.lastSearch);
    selectedTransaction.set(undefined);
  }

})