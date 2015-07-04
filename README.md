# glados
Monitor remote resource for changes



### To Do
- cli script
	- accept: watch, endpoints for handlers
	- what to do if thing goes down
		- probly boot back up
		- save data on hand so when we boot back up, we wont have missed a change
- consider calling back with untreated diffLines(), 2 advantages:
	- we can swap out diffLines with any method from diff module
	- listeners can present pretty reports
- finish tests + travisit
- readme

