(function() {

	userInfo = {
		loginAs: 0, //0 as not login, 1 as student, 2 as instructor
		username: "Wei",
		errors: {
			errorName: true,
			errorEmail: true,
			errorAuthen: true,
		}
	};

	angular.module('platform-index', [])

	.directive('navBar', [function() {
		return {
			restrict: 'E',
			templateUrl: "nav.html",
			// controlerAs:"nav", 
			controller: ['$scope', function($scope) {
				//pass links throught json
				$scope.links = {
					home: "index.html",
					other: "other.html",
					login: "login.html",
				}
			}],
		};
	}])

	.controller('FuncCtrl', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope) {
		$rootScope.info = userInfo;
		$http.get('/initUser').success(function(data) {
			$rootScope.info = data;
		})
	}])

	.controller('SignupCtrl', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope) {
		$scope.formData = {};
		$scope.role = 1;
		$scope.errorName = false;
		$scope.errorEmail = false;

		$scope.submitForm = function() {
			$scope.formData = {
				role: $scope.role,
				username: document.getElementById('s-username').value,
				password: document.getElementById('s-password').value,
				email: document.getElementById('s-email').value,
			};
			$http({
					method: 'POST',
					url: '/register',
					data: $.param($scope.formData),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					xhrFields: {
						withCredentials: true
					}
				})
				.success(function(data) {

					if (!data.success) {
						$scope.errorName = data.errors.errorName; //true if user has been taken
						$scope.errorEmail = data.errors.errorEmail; //true if email has been registered
					} else {
						console.log(data)
						$rootScope.info = data;
						$('#signupModal').modal('hide');
					}

				});
		};

	}])

	.controller('LoginCtrl', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope) {
		$scope.formData = {};
		$scope.errorAuthen = false;

		$scope.submitForm = function() {
			$scope.formData = {
				username: document.getElementById('l-username').value,
				password: document.getElementById('l-password').value,
			};
			$http({
					method: 'POST',
					url: '/login',
					data: $.param($scope.formData), 
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					xhrFields: {
						withCredentials: true
					}
				})
				.success(function(data) {
					// console.log(data)
					if (!data.success) {
						// if not successful, bind errors to error variables
						$scope.errorAuthen = data.errors.errorAuthen; //true not match

					} else {
						// if success, update user data and apply
						$rootScope.info = data;
						$('#loginModal').modal('hide');
					}

				});
		};

	}])

	.controller('LogoutCtrl', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope) {
		$scope.logOut = function() {
			$http.get('/logout').success(function(data) {
				$rootScope.info = data;
			})
		}
	}])

})()

jQuery(document).ready(function($) {

	$('[data-toggle="tooltip"]').tooltip();
	$('#index-wrap').height($(window).height());

});