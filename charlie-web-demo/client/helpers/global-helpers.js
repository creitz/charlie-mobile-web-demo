
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

Template.registerHelper('formatDate', function(dateStr) {

  if (dateStr == null) {
    return '';
  }

  return new Date(dateStr).toDateString().slice(0, -5);
});