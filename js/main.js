var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'templates/home.html', 
		controller: 'HomeController' 
	})
	.when('/settings', {
		templateUrl: 'templates/settings.html',
		controller: 'SettingsController'
	})
	.otherwise({ redirectTo: '/' });
});

app.service('mailService', ['$http', '$q', function($http, $q){
	

	var sendEmail = function(mail) {
		var d = $q.defer();
		$http({
			method: 'POST',
			data: mail,
			url: '/api/send'
		}).success(function(data, status, headers) {
			d.resolve(data);
		}).error(function(data, status, headers){
			d.reject(data);
		});
		return d.promise;
	};
	var getMail = function() {
		return $http({
			method: 'GET',
			url: '/api/mail'
		});
	};

	return {
		getmail: getMail,
		sendEmail: sendEmail
	}
}]);

app.controller('HomeController', function($scope) {
	$scope.selectedMail;

	$scope.setSelectedMail = function(mail) {
		$scope.selectedMail = mail;
	};

	$scope.isSelected = function(mail) {
		if ($scope.selectedMail) {
			return $scope.selected
		}
	}
});

app.controller('MailListingController', ['$scope', 'mailService', function($scope, mailService) {
	$scope.email = [{
		'id' : 1,
		'from': 'fred@test.de',
		'to' : 'ari@test.de',
		'subject': 'Great Angular',
		'body': 'Congrats, Angular is Awesome!',
		'sent_at': '2014-01-15T18:30:30'
	}];
	mailService.getMail()
	.success(function(data, status, headers){
		$scope.email = data.all;
	})
	.error(function(data, status, headers) {

	});
}]);

// MailListingController.$inject = ['$scope', '$http']; -> Alternative to the Array in the controller

app.controller('ContentController', ['$scope', 'mailService', '$rootScope', function($scope, mailService, $rootScope){
	$scope.showingReply = false;
	$scope.reply = {};


	$scope.toggleReply = function () {
		$scope.showingReply = !$scope.showingReply;
		$scope.reply = {};
		$scope.reply.to = $scope.selectedMail.from;
		$scope.reply.body = "\n\n ------------\n\n" + $scope.selectedMail.body;
	};

	$scope.sendReply = function() {
		$scope.showingReply = false;
		$rootScope.loading = true;
		mailService.sendEmail($scope.reply)
		.then(function(status) {
			$rootScope.loading = false;
		}, function(err) {
			$rootScope.loading = false;
		});
	}

	$scope.$watch('selectedMail', function(evt){
		$scope.showingReply = false;
		$scope.reply = {};
	});

}]);

app.controller('SettingsController', function($scope){
	$scope.settings = {
		name : "Ari",
		email: "me@example.com"
	};

	$scope.updateSettings = function() {
		console.log("updateSettings was called");
	}
});