var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MailingList = new Schema({
  company_id: {
    type: Schema.Types.ObjectId
  },
  name: {
    type: String
  },
  email: {
    type: String
  }
});

module.exports = mongoose.model('MailingList', MailingList, 'mailing_lists');
