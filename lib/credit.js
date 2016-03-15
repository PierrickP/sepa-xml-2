'use strict';

/**
 * This callback is displayed as part of the Requester class.
 * @callback Credit~compileCb
 * @param {String[]}  error Array of string errors
 * @param {string}    xml   XML file content
 */

var Handlebars = require('handlebars');
var fs = require('fs');

var Payment = require('./payment.js');

Handlebars.registerHelper('formatDate', function(dto) {
  return new Handlebars.SafeString(formatDate(dto));
});

Handlebars.registerHelper('timestamp', function() {
  var dto = new Date();
  return new Handlebars.SafeString(dto.toJSON().toString());
});


function formatDate(dto) {
  dto = dto || new Date();

  var month = (dto.getMonth() + 1).toString();
  var day = dto.getDate().toString();

  return dto.getFullYear().toString() + '-' + (month[1] ? month : '0' + month) + '-' + (day[1] ? day : '0' + day);
}

/**
 * Credit instance
 *
 * Credit is a wrapper of payments.
 * Set headers with `setHeaderInfo()` and add payments to it with `addPayment()`.
 * Render to XML if validations pass with `compile()`.
 */
class Credit {
  constructor (version) {
    this.options = {
      version: version
    };

    this._header = {
      messageId: null,
      initiator: null
    };

    this._payments = [];
  }

  /**
   * Set options for this instance
   * @param {String} version Template version
   */
  setOptions(version) {
    this.options.version = version;
  }

  /**
   * Set Credit headers
   * @param {Object} params
   * @param {String} [params.messageId] Message Id
   * @param {String} [params.initiator] Credit initiator name
   */
  setHeaderInfo(params) {
    for (var p in params) {
      this._header[p] = params[p];
    }
  }

  /**
   * Add a payment instance to the credit instance
   * @param {lib/payment} payment Payement instance
   */
  addPayment(payment) {
    this._payments.push(payment);
  }

  /**
   * Render XML file
   * @param {Credit~compileCb} cb Callback
   */
  compile(cb) {
    var _self = this;

    this.verifyCurrentInfo(function (err) {
      if (err) return cb(err);

      fs.readFile(__dirname + '/../formats/' + _self.options.version + '.hbs', 'utf8', function (err, source) {
        if (err) return cb(err);

        var template = Handlebars.compile(source);
        cb(null, template(_self.templateData()));
      });
    });
  }

  templateData() {
    var controlSum = 0;
    var transactionCount = 0;

    for (var i = 0; i < this._payments.length; i++) {
      var paymentCtrlSum = 0;
      var paymentTransactionCount = this._payments[i]._transactions.length;

      for (var j = 0; j < this._payments[i]._transactions.length; j++) {
        paymentCtrlSum += parseFloat(this._payments[i]._transactions[j].amount)
        controlSum += parseFloat(this._payments[i]._transactions[j].amount);
      }

      transactionCount += paymentTransactionCount;
      this._payments[i]._info.transactionCount = paymentTransactionCount;
      this._payments[i]._info.transactionControlSum = paymentCtrlSum;
    }

    this._header.transactionCount = transactionCount;
    this._header.transactionControlSum = controlSum;

    return {
      _header: this._header,
      _payments: this._payments
    };
  }

  verifyCurrentInfo(cb) {
    var errors = [];

    for (var p in this._header) {
      if (this._header[p] === null) errors.push('You have not filled in the `' + p + '`.');
    }

    if (this._payments.length === 0) errors.push('The list of payments is empty.');

    this._payments.forEach(function (payment) {
      for (var p in payment.info) {
        if (payment.info[p] === null) errors.push('You have not filled in the `' + p + '` for payments.');
      }

      if (payment._transactions.length === 0) errors.push('The list of transactions is empty.');
    });

    cb((errors.length === 0) ? null : errors);
  }
}

Credit.prototype.createPayment = Payment;

module.exports = Credit;
