import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TransactionLoader } from '../services/transaction-loader.js';

var searchDelayTimer;
var lastSearch;
var selectedTransaction = new ReactiveVar();
var searchText = new ReactiveVar("");
var loader;

function load() {
  loader.load(searchText.get());
}

function search() {
  
  var searchString = searchText.get();
  if (lastSearch !== searchString) {
    lastSearch = searchString;
    loader.scrollManager.reset();
    load()
  }
}

Template.transactions.onCreated(function onCreated() {
  loader = new TransactionLoader();
  load();
});

Template.transactions.helpers({

  data: function() {
    return loader.getResponseData();
  },

  searchText: function() {
    return searchText.get();
  },

  transactionsForDate: function(date) {
    var data = loader.getResponseData();
    return data.dateMap[date];
  },

  sumForDate: function(date) {
    var data = loader.getResponseData()
    var sum = 0;
    data.dateMap[date].forEach(function(txn) {
      sum += txn.amount;
    });
    return sum;
  },

  canLoadMore: function() {
    return loader.canLoadMore();
  },

  selectedTransaction: function() {
    return selectedTransaction.get();
  }
});

Template.transactions.events({

  'keyup #transaction-search': function(event) {
    event.preventDefault();
    searchText.set($(event.currentTarget).val());
    clearTimeout(searchDelayTimer);
    searchDelayTimer = setTimeout(function() {
      search();
    }, 350);
  },

  'click #loadMore': function(event) {
    load();
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
    search();
  }
});

Template.transactionDetails.events({

  'click #back': function() {
    $('#transaction-search').val(this.lastSearch);
    selectedTransaction.set(undefined);
  }

})