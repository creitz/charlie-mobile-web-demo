export function ScrollManager() {

  this.limit = 50;
  this.page = 0;

  this.getOffset = function() {
    return this.limit * this.page;
  }

  this.advance = function() {
    this.page += 1;
  }

  this.reset = function() {
    this.page = 0;
  }

};