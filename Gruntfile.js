module.exports = function(grunt) {

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),

  less: {
    development: {
      options: {
        compress: true,
        yuicompress: true,
        optimization: 2
      },
      files: {
        "static/css/main.css": "static/css/main.less" // destination file and source file
      }
    }
  },

  watch: {
    scripts: {
      files: ['static/css/**/*.less'],
      tasks: ['less'],
      options: {
        spawn: false,
      },
    },
  }

});

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-less');

grunt.registerTask('default', ['less', 'watch']);

};