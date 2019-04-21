
function organizeTxnsByDate(data) {

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

export let TransactionService = {

  getTransactions: function(user_id, params) {
    
    return new Promise(function(resolve, reject) {
      Meteor.call('getTransactions', user_id, params, function(error, result) {
          if (error) {
            console.log('Error: ' + error);
            reject(error);
          } else if (result.data && result.statusCode == 200) {
            var data = result.data;
            organizeTxnsByDate(data);
            resolve(data);
          } else {
            reject();
          }
      });
    });
  }
}