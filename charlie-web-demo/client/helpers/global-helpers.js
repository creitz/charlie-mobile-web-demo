
const NUM_DECIMALS = 2;

Template.registerHelper('formatMoney', function(amount) {
  if (amount == null) {
    return '';
  }

  if (amount < 0) {
    return "-$" + (amount * -1).toFixed(NUM_DECIMALS);
  } else {
    return "$" + amount.toFixed(NUM_DECIMALS);
  }
});