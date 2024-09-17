const forEachAsync = require('foreachasync').forEachAsync;
const mongoose = require('mongoose');   
// Setup schema
const  UserSchema = mongoose.Schema({},{
    collection: 'tbl_admin',
    strict: false,
    timestamps: true,
});  

 module.exports = mongoose.model('tbl_admin', UserSchema);  
 
 