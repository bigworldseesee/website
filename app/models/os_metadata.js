// app/models/os_metadata.js
var mongoose = require('mongoose');

// schema for os metadata
var osMetadataSchema = mongoose.Schema({
    id : Number,
    name : String,
    version : String,
    description : String,
    webPath : String,
    iconLocation : String,
    template : String,
});

module.exports = mongoose.model('OsMetadata', osMetadataSchema);
