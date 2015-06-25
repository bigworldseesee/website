var clients = angular.module('clientSelection', []);
clients.controller('osLinkCtrl', function($scope){
	$scope.osClients = [
	{
		osName : "Windows",
		osVersion : "7+",
		description : "Download Windows Client",
		link : "http://128.199.133.225:3000/download/client/windows",
		icon : "img/windows.png",
		manualUrl: "'./partials/WindowsManualSetup.ejs'",
	},
	{
		osName : "Android",
		osVersion : "4.0+",
		description : "Download Android Client",
		link : "http://128.199.133.225/download/client/android",
		icon : "img/android.png",
		manualUrl: "'./partials/AndroidManualSetup.ejs'",
	},
	{
		osName : "iOS",
		osVersion : "6+",
		description : "Download iOS Client",
		link : "http://128.199.133.225/download/client/ios",
		icon : "img/ios.png",
		manualUrl: "'./partials/iOSManualSetup.ejs'",
	},
	{
		osName : "OS X",
		osVersion : "10",
		description : "Download OS X Client",
		link : "http://128.199.133.225/download/client/osx",
		icon : "img/osx.png",
		manualUrl: "'./partials/OSXManualSetup.ejs'",
	},
	];
});
