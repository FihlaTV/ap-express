(function() {

	angular.module('platform-list', [])

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

	.controller('TaginfoCtrl', ['$scope', function($scope) {
		$scope.data = {
			canEdit: true,
			tag: "JavaScript",
			abstract: "JavaScript (not to be confused with Java) is a dynamic, weakly-typed language used for client-side as well as server-side scripting. Use this tag for questions regarding ECMAScript and its various dialects/implementations (excluding ActionScript and Google-Apps-Script). Unless another tag for a framework/library is also included, a pure JavaScript answer is expected.",
			intro: "<p><b>JavaScript</b> is a dynamic, object-based, prototype-based, weakly typed language traditionally used for client-side scripting in web browsers. javascript can also be run outside of the browser with the use of a framework like . Despite the name, it is unrelated to the Java programming language and shares only superficial similarities.&nbsp;</p><blockquote><p>Unless a tag for a framework or library is also included, a pure JavaScript answer is expected for questions with the tag.</p></blockquote>",
		};

		$scope.startEdit = false;

		$scope.isActive = false;

		$scope.editText = "edit";

		$scope.saveText = "save";

		$scope.isSaved = false;

		$scope.enableEdit = function() {
			$scope.isActive = true;
			$scope.startEdit = true;
			$scope.editText = "editing";
		};

		$scope.save = function() {
			$scope.isSaved = true;

			var tagInfo = {
				tag: document.getElementById('tag-name').innerHTML,
				abstract: document.getElementById('tag-abstract').innerHTML,
				intro: document.getElementById('tag-intro').innerHTML,
			};

			// to be removed

			var d = new Date();
			$scope.saveText = "saved at " + d.getHours() + ":"+(d.getMinutes()<10?'0':"")+ d.getMinutes();

			// replaced with
			// $http({
			// 		method: 'POST',
			// 		url: 'saveTagProcess', 
			// 		data: $.param(tagInfo), 
			// 		headers: {
			// 			'Content-Type': 'application/x-www-form-urlencoded'
			// 		} 
			// 	})
			// 	.success(function(data) {
			// 		if (!data.success) {
			// 			$scope.saveText = "not saved";
			// 		} else {
			//			var d = new Date();
			// 			$scope.saveText = "saved at " + d.getHours() + ":" + (d.getMinutes()<10?'0':"")+ d.getMinutes();
			// 		}
			// 	});

		}

	}])

	.filter('unsafe', function($sce) {
		return $sce.trustAsHtml;
	})

})()

// not sure why those error messages on console, although it doesn't affect the way it works.
jQuery(document).ready(function($) {
	$('#editing').one('click', function(event) {
		var editor = new Minislate.simpleEditor(document.getElementById('tag-intro'));
	});
});