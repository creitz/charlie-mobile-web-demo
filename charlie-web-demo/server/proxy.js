
import './config/routes.js';

Meteor.startup(function () {

  Meteor.methods({

    'getTransactions': function(user_id, params) {
      
      return new Promise(function(resolve, reject) {
        var url = Routes.API.charlie.transactions(user_id);
        console.log('going to request: ' + url + " with params " + JSON.stringify(params));
        HTTP.call( 'GET', url, {
          params: params
        }, function( error, response ) {
          if (error) {
            reject(error)
          } else {
            resolve(response);
          }
        });
      })
    }
  });
});