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
  }
}