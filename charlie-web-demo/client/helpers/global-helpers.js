import { Utils } from "../util/utils";

Template.registerHelper('formatMoney', function(amount) {
  return Utils.formatMoney(amount);
});

Template.registerHelper('formatDate', function(dateStr) {

  if (dateStr == null) {
    return '';
  }

  return new Date(dateStr).toDateString().slice(0, -5);
});