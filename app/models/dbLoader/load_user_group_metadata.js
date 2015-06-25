var mongoose = require('mongoose');
var configDB = require('../../../config/database');
var UserGroupMetadata = require('../user_group_metadata');

var conn = mongoose.connect(configDB.url, function(err){
    if(err) throw err;
    console.log('connecgted ' + configDB.url);

    var count = 0;
    var gp = new UserGroupMetadata();
    gp.id = 0;
    gp.name = 'auto_manual_setup_experiment_Manual';
    gp.save(function(err){
        if(err) console.log(err);
        ++count;
        if(count == 2)
        {
            mongoose.disconnect(function(err){
		if(err) throw err;
		console.log('disconnected');
            });
        }
    });

    gp = new UserGroupMetadata();
    gp.id = 1;
    gp.name = 'auto_manual_setup_experiment_Auto';
    gp.save(function(err){
        if(err) console.log(err);
        ++count;
        if(count == 2)
        {
            mongoose.disconnect(function(err){
		if(err) throw err;
		console.log('disconnected');
	    });
        }
    });

});
