var mongoose = require('mongoose');
var configDB = require('../../../config/database');
var osMetadata = require('../os_metadata');

mongoose.connect(configDB.url, function(err){
    if(err) throw err;
    console.log('connecgted ' + configDB.url);

var upload = function(){
    var count = 0;
    var os = new osMetadata();
    os.id = 1;
    os.name = 'Windows';
    os.version = '7+';
    os.description = '';
    os.webPath = 'http://128.199.133.225:3000/download/client/Windows';
    os.iconLocation = 'img/windows.png';
    os.template = './partials/WindowsManualSetup.ejs';

    os.save(function(err){
        if(err) console.log(err);
        ++count;
        if(count == 4)
        {
            mongoose.disconnect();
        }
    });
    
    os = new osMetadata();
    os.id = 2;
    os.name = 'Android';
    os.version = '4.0+';
    os.description = '';
    os.webPath = 'http://128.199.133.225:3000/download/client/Android';
    os.iconLocation = 'img/android.png';
    os.template = './partials/AndroidManualSetup.ejs';

    os.save(function(err){
        if(err) console.log(err);
        ++count;
        if(count == 4)
        {
            mongoose.disconnect();
        }
    });
    
    os = new osMetadata();
    os.id = 3;
    os.name = 'iOS';
    os.version = '6+';
    os.description = '';
    os.webPath = 'http://128.199.133.225:3000/download/client/iOS';
    os.iconLocation = 'img/ios.png';
    os.template = './partials/iOSManualSetup.ejs';

    os.save(function(err){
        if(err) console.log(err);
        ++count;
        if(count == 4)
        {
            mongoose.disconnect();
        }
    });
    
    os = new osMetadata();
    os.id = 4;
    os.name = 'OSX';
    os.version = '10';
    os.description = '';
    os.webPath = 'http://128.199.133.225:3000/download/client/OSX';
    os.iconLocation = 'img/osx.png';
    os.template = './partials/OSXManualSetup.ejs';

    os.save(function(err){
        if(err) console.log(err);
        ++count;
        if(count == 4)
        {
            mongoose.disconnect();
        }
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