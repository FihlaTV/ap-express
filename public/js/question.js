(function() {
	
	angular.module('platform-question', [])

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


	.controller('QuestionCtrl', ['$scope', function($scope) {
		// get initial question data
		// $scope.question={};
		// $http.get('/question.json').success(function(data) {
		// 	$scope.question=data; //data to be a list of questions
		// 	$scope.$apply();
		// })
		$scope.question = {
			title: "Nest Thermostat temperature not getting updated",
			content: "I am trying to change the temperature of my Nest programmatically (Android), without any luck. Requests work maybe 1 in 30-50 tries. \n\
					I have tried doing it through the Firebase Nest SDK, \n \
					and the NestAPI.CompletionListener doesn 't get called at all. Seeing how that doesn' \
					t work,\n \
					I tried it with the REST api,  \
					where it worked twice, \
					and then again 1 in 30 tries.I also tried it with curl from the command line, \n \
					with the same results, \n \
					until I \
					finally got \"blocked\"  \
					because of the rate limiting.Before being blocked, \
					requests were returning the full thermostat object,\
					just like doing a GET request instead of PUT.\
					When the temperature actually didget updated,\n \
					the response contained just the new target_temperature_high_c and target_temperature_high_c values.\n \
					Has anyone else seen similar behavior ?\n \
						Edit : added some code below\n \
					Here 's my code using the Nest Android API (based on Firebase):",
			hasCode: true,
			code: "from django.db import models \n \
						class Poll(models.Model): question = models.CharField(max_length = 200) \n \
						pub_date = models.DateTimeField('date published') \n \
						class Choice(models.Model): poll = models.ForeignKey(Poll) \n \
						choice_text = models.CharField(max_length = 200) \n \
						votes = models.IntegerField( \n \
							default = 0) \n \
						# ndsaklsdhaslk \n \
						class FreshJuice { \n \
							enum FreshJuiceSize { \n \
								SIZE, MEDIUM, LARGE \n \
							} \n \
							FreshJuiceSize size; \n \
						} \n \
					}",
			answer: "The day-to-day working JSAV repository is located at GitHub. For new developers who want to use the Github working version of JSAV: \n \
					Install Git\n\
					Check out the JSAV repository.For example, at the commandline you can do the following to create a new JSAV folder or directory: git clone git: //github.com/vkaravir/JSAV.git JSAV (Note that this is a read-only URL. If you are joining the developer team, and you are not sufficiently familiar with Git to know what to do to set things up right to be able to push changes, talk to us about it.)\n \
							Go to the JSAV folder or directory that you just created and run: make This will \"compile\"\
						the\n \
						pieces together\n \
					for you.At this point, you are ready to\n \
					try out the examples or invoke your copy of JSAV in your own development projects.\n \
					For SVN users new to git: \n \
						To \"checkout\" a new copy of the library, use \"git clone\".\n \
					To \"update\" your copy of the repository, use \"git pull\".",
			tags: ["Python", "Array"],
			download_link: "http://google.com",
		};
	}]);



})()

jQuery(document).ready(function($) {

	prettyPrint();

});