
Routes = {

  API : {
    charlie: {
      protocol: 'https://',
      endpoint: 'wooboy.hicharlie.com/fake_api/v1.0/',
      base: '', //placeholder for visual ref
      init: function() {
        this.base = this.protocol + this.endpoint;
        this.transactions = function(user_id) {
          return this.base + 'users/' + user_id + '/transactions/'
        }
        delete this.init;
        return this;
      }
    }.init()
  }

}