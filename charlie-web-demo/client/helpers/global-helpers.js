Template.registerHelper('formatMoney', function(amount) {
  if (amount == null) {
    return '';
  }
  if (amount < 0) {
    return "-$" + (amount * -1);
  } else {
    return "$" + amount;
  }
});