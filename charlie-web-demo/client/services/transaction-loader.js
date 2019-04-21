
import { TransactionService } from '../services/transaction-service.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Utils } from '../util/utils.js';
import { ScrollManager } from '../util/scroll-manager.js';

const DUMMY_USER_ID = "9999";

export function TransactionLoader() {

  this.scrollManager = new ScrollManager();
  var maybeMore      = new ReactiveVar(true);
  var responseData   = new ReactiveVar(0);

  this.load = function(searchString) {

    var self = this;

    var page = this.scrollManager.page;
    var limit = this.scrollManager.limit;
    var params = {
                  "search_string" : searchString || "",
                  "limit"         : limit,
                  "offset"        : this.scrollManager.getOffset()
                  };
    TransactionService.getTransactions(DUMMY_USER_ID, params).then(function(newData) {
      var data = responseData.get();
      if (page == 0 || !data || !data.transactions) {
        data = newData;
      } else {
        data.transactions = data.transactions.concat(newData.transactions);
        data.offset = newData.offset;
        data.limit = newData.limit;
      }
      var hasTransactions = newData.transactions && newData.transactions.length > 0;
      if (hasTransactions) {
        self.scrollManager.advance();
      }
      maybeMore.set(hasTransactions && newData.transactions.length === limit);
      Utils.organizeTxnsByDate(data);
      responseData.set(data);
    }).catch(function(error) {
      alert(error);
    });
  }

  this.canLoadMore = function() {
    return maybeMore.get();
  }

  this.getResponseData = function() {
    return responseData.get();
  }
}