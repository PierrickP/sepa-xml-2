'use strict';

var payment = require('./payment');

/**
 * Payment class
 *
 * @description
 * This class is a wrapper of transaction.
 * A payment has one credit source and *n* destinations (specified in transactions).
 * The credit source a specified in the header (`setInfo()`)
 * Add transactions to it with `addTransaction()`
 * *bic* field aren't mandatory, it can be found with the IBAN
 */
class Payment {
  constructor(info) {
    this._info =  {
      id: info.id,
      method: info.method,
      senderName: info.name,
      senderIBAN: info.iban,
      bic: info.bic,
      batchBooking: false
    };

    this._transactions = [];
  }

  /**
   * Set Payment headers
   * @param {Object} params
   * @param {String} [params.id]            Message Id
   * @param {String} [params.method]        Payment method
   * @param {String} [params.senderName]    Debitor name
   * @param {String} [params.senderIBAN]    Debitor IBAN
   * @param {String} [params.bic]           BIC
   * @param {String} [params.batchBooking]  Batch Booking
   */
  setInfo(params) {
    for (var p in params) {
      this._info[p] = params[p];
    }
  }

  /**
   * Add transcation to transaction
   * @param {Object} transaction
   * @param {String} transaction.id     Transaction Id
   * @param {Number} transaction.amount Transaction amount
   * @param {String} transaction.name   Recipient name
   * @param {String} transaction.iban   Recipient iban
   * @param {String} [transaction.bic]  BIC
   */
  addTransaction(transaction) {
    if (!transaction || !transaction.iban || !transaction.name || !transaction.amount || !transaction.id) return false;
    if (!transaction.bic) transaction.bic = require('./bic.js')(transaction.iban);

    this._transactions.push({
      endToEndId: transaction.id,
      amount: transaction.amount,
      bic: transaction.bic,
      recipientName: transaction.name,
      recipientIBAN: transaction.iban
    });
  }
}

module.exports = Payment;
