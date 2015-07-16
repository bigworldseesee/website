var mongoose = require('mongoose');
var config = require('../../../config/config');

var osMetadata = require('../os_metadata');

mongoose.connect(config.database.url, function(err){
    if(err) throw err;
    console.log('connecgted ' + config.database.url);

var upload = function(){
    var url = '';
    var count = 0;
    var os = new osMetadata();
    os.id = 1;
    os.name = 'Windows';
    os.version = '7+';
    os.description = '';
    os.webPath = url + '/download/client/Windows';
    os.iconLocation = 'img/windows.png';
    os.template = '/partials/WindowsManualSetup.ejs';

    os.save(function(err){
        if(err) console.log(err);
    
    os = new osMetadata();
    os.id = 2;
    os.name = 'Android';
    os.version = '4.0+';
    os.description = '';
    os.webPath =  url + '/download/client/Android';
    os.iconLocation = 'img/android.png';
    os.template = '/partials/AndroidManualSetup.ejs';

    os.save(function(err){
        if(err) console.log(err);
    
    os = new osMetadata();
    os.id = 3;
    os.name = 'iOS';
    os.version = '6+';
    os.description = '';
    os.webPath = url + '/download/client/iOS';
    os.iconLocation = 'img/ios.png';
    os.template = '/partials/iOSManualSetup.ejs';

    os.save(function(err){
        if(err) console.log(err);

    os = osMetadata();
    os.id = 4;
    os.name = 'OSX';
    os.version = '10';
    os.description = '';
    os.webPath = url + '/download/client/OSX';
    os.iconLocation = 'img/osx.png';
    os.template = '/partials/OSXManualSetup.ejs';

    os.save(function(err){
        if(err) console.log(err);
            mongoose.disconnect();
})})})
    });
}

    osMetadata.remove(function(err){
	if(err)
	{
	   console.log(err);
	   mongoose.disconnect();
	   throw err;
	}
	console.log("Cleared old osmetadatas table");
	upload();
    });
});
