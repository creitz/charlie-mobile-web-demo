
export let TransactionService = {

  getTransactions(user_id, params) {
    
    return new Promise(function(resolve, reject) {
      Meteor.call('getTransactions', user_id, params, function(error, result) {
          if (error) {
            console.log('Error: ' + error);
            reject(error);
          } else if (result.data && result.statusCode == 200) {
              resolve(result.data);
          } else {
            reject();
          }
      });
    });
  }
}