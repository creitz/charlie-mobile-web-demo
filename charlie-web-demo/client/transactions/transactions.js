import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TransactionService } from '../services/transaction-service.js';
import { ScrollManager } from '../util/scroll-manager.js';
import { Utils } from '../util/utils.js';

const DUMMY_USER_ID = "9999";

var load;
var searchDelayTimer;
var lastSearch;
var selectedTransaction = new ReactiveVar();
var searchText = new ReactiveVar("");
var scrollManager = new ScrollManager();
var canLoadMore = new ReactiveVar(true);

function search() {
  
  var searchString = searchText.get();
  if (lastSearch !== searchString) {
    lastSearch = searchString;
    scrollManager.reset();
    load()
  }
}

function _load() {
  
  var searchString = searchText.get();
  var self = this;
  var page = scrollManager.page;
  var limit = scrollManager.limit;
  var params = {
                "search_string" : searchString || "",
                "limit"  : limit,
                "offset" : scrollManager.getOffset()
                };
  TransactionService.getTransactions(DUMMY_USER_ID, params).then(function(newData) {
    var data = self.responseData.get();
    if (page == 0 || !data || !data.transactions) {
      data = newData;
    } else {
      data.transactions = data.transactions.concat(newData.transactions);
      data.offset = newData.offset;
      data.limit = newData.limit;
    }
    var hasTransactions = newData.transactions && newData.transactions.length > 0;
    if (hasTransactions) {
      scrollManager.advance();
    }
    canLoadMore.set(hasTransactions && newData.transactions.length == limit);
    Utils.organizeTxnsByDate(data);
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

  canLoadMore: function() {
    return canLoadMore.get();
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