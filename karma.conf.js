module.exports = function(config) {
  config.set({
    files: [
      'src/**/*.js',
      'test/**/*.js'
    ],
    plugins: [
      'karma-coverage',
      'regenerator'
    ],
 
    // coverage reporter generates the coverage 
    reporters: ['progress', 'coverage'],
 
    preprocessors: {
      // source files, that you wanna generate coverage for 
      // do not include tests or libraries 
      // (these files will be instrumented by Istanbul) 
      'src/**/*.js': ['regenerator']
    },
    regenreatorPreprocessor: {
      options: {
        includeRuntime: true
      }
    },
    // optionally, configure the reporter 
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }
  });
};
