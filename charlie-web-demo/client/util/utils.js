
const NUM_DECIMALS = 2;

export let Utils = {

  organizeTxnsByDate : function (data) {

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

  formatMoney : function (amount) {
    if (amount == null) {
      return '';
    }
  
    if (amount < 0) {
      return "-$" + (amount * -1).toFixed(NUM_DECIMALS);
    } else {
      return "$" + amount.toFixed(NUM_DECIMALS);
    }
  }
}