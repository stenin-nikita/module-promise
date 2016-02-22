test:
	node test/utils/runner.js

benchmark:
	node benchmarks/comparison.js

min:
	node ./node_modules/uglify-js/bin/uglifyjs lib/promise.js > promise.min.js