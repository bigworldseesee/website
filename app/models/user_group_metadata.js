// app/models/user_group_metadata.js

var mongoose = require('mongoose');

var userGroupMetadataSchema = mongoose.Schema({
    id : Number,
    name : String,
});

module.exports = mongoose.model('UserGroupMetadata', userGroupMetadataSchema);
