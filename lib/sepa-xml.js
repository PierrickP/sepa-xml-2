'use strict';

var credit = require('./credit.js');

var sepa = {

  options: {
    creditVersion: 'pain.001.001.03'
  },

  /**
   * Set global options
   * @param {Object} options
   * @param {String} [options.creditVersion="pain.001.001.03"]  Template version for credit
   */
  setOptions: function (options) {
    Object.assign(sepa.options, options);
  },

  /**
   * Create a new instance credit
   * @param  {String} [version]  Template version
   * @return {Credit} Credit Instance
   */
  createCredit: function (version){
    return new credit(version || sepa.options.creditVersion);
  }

};

module.exports = sepa;
