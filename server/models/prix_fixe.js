var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PrixFixe = new Schema({
  company_id: {
    type: Schema.Types.ObjectId
  },
  menus: [{ type: Schema.Types.ObjectId, ref: 'Menu'}],
  name: {
    type: String
  }
});

module.exports = mongoose.model('PrixFixe', PrixFixe, 'prixfixes');
