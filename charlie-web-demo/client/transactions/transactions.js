import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TransactionLoader } from '../services/transaction-loader.js';
import { Utils } from "../util/utils";

var searchDelayTimer;
var selectedTransaction = new ReactiveVar();
var selectedCategory    = new ReactiveVar();
var searchText = new ReactiveVar("");
var searchMin  = new ReactiveVar();
var searchMax  = new ReactiveVar();
var loader;

function search() {
  
  loader.scrollManager.reset();
  load();
}

function hasVal(val) {
  return val && val.trim() !== "";
}

function hasSearchMin() {
  return hasVal(searchMin.get());
}

function hasSearchMax() {
  return hasVal(searchMax.get());
}

function load() {
  
  var params = {
    "search_string" : searchText.get() || ""
  }

  if (hasSearchMin()) {
    var min = parseInt(searchMin.get());
    if (min != NaN) {
      params["amount_min"] = min;
    }
  }

  if (hasSearchMax()) {
    var max = parseInt(searchMax.get());
    if (max != NaN) {
      params["amount_max"] = max;
    }
  }

  var category = selectedCategory.get();
  if (category) {
    params["category"] = category;
  }

  loader.load(params)
}

function startSearchTimer() {
  clearTimeout(searchDelayTimer);
  searchDelayTimer = setTimeout(function() {
    search();
  }, 350);
}

function sumForDate(date) {
  var data = loader.getResponseData()
  var sum = 0;
  data.dateMap[date].forEach(function(txn) {
    sum += txn.amount;
  });
  return sum;
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
    return sumForDate(date);
  },

  summary: function() {

    var data = loader.getResponseData();
    var total = 0;
    data.transactionDates.forEach(function(date) {
      total += sumForDate(date);
    });

    return Utils.formatMoney(total);
  },

  canLoadMore: function() {
    return loader.canLoadMore();
  },

  loading: function() {
    return loader.isLoading();
  },

  selectedTransaction: function() {
    return selectedTransaction.get();
  },

  selectedCategory: function() {
    return selectedCategory.get();
  },

  searchMin: function() {
    return searchMin.get();
  },

  searchMax: function() {
    return searchMax.get();
  },

  collapseFilters: function() {
    return selectedCategory.get() != null
        || hasSearchMin()
        || hasSearchMax()
        ? "" : "collapse";
  }
});

Template.transactions.events({

  'keyup #transaction-search': function(event) {
    event.preventDefault();
    searchText.set($(event.currentTarget).val());
    startSearchTimer()
  },

  'keyup #minInput, change #minInput': function(event) {
    event.preventDefault();
    searchMin.set($(event.currentTarget).val());
    startSearchTimer()
  },

  'keyup #maxInput, change #maxInput': function(event) {
    event.preventDefault();
    searchMax.set($(event.currentTarget).val());
    startSearchTimer();
  },

  'click #loadMore': function(event) {
    event.preventDefault();
    load();
  },

  'click #removeCategory': function(event) {
    event.preventDefault();
    selectedCategory.set(null);
    search();
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
    selectedTransaction.set(undefined);
  },

  'click #category': function(event) {
    event.preventDefault();
    selectedCategory.set(this.category);
    selectedTransaction.set(null);
    search();
  }

})