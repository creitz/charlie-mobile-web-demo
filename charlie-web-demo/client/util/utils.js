
const NUM_DECIMALS = 2;

export let Utils = {

  organizeTxnsByDate: function (data) {

    data.dateMap = {};
    data.transactionDates = [];
    
    data.transactions.forEach(function(txn) {
      
      var txnsForDate = data.dateMap[txn.date];
      if (!txnsForDate) {
        txnsForDate = [];
        data.dateMap[txn.date] = txnsForDate;
        data.transactionDates.push(txn.date);
      }
      txnsForDate.push(txn);
    });
  },

  formatMoney: function (amount) {
    if (amount == null) {
      return '';
    }
  
    if (amount < 0) {
      return "-$" + (amount * -1).toFixed(NUM_DECIMALS);
    } else {
      return "$" + amount.toFixed(NUM_DECIMALS);
    }
  },

  extend: function(defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
      if (defaults.hasOwnProperty(prop)) {
          extended[prop] = defaults[prop];
      }
    }
    for (prop in options) {
      if (options.hasOwnProperty(prop)) {
        extended[prop] = options[prop];
      }
    }
    return extended;
  }
}