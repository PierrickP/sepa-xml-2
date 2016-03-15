# SEPA-XML-2

[![Build Status](https://travis-ci.org/PierrickP/sepa-xml-2.svg?branch=master)](https://travis-ci.org/PierrickP/sepa-xml-2)
[![Coverage Status](https://coveralls.io/repos/github/PierrickP/sepa-xml-2/badge.svg?branch=master)](https://coveralls.io/github/PierrickP/sepa-xml-2?branch=master)

Based on https://github.com/mgmco/sepa-xml this NPM module generate SEPA XML file for **credit** (ask me for *debit*)

## Changes from the original module 

+ Implemente `pain.001.001.03` & `pain.001.001.02`
+ Allow creating multiple instances
+ Multi *payment* blocs
+ Validations


## Usage

### Credit

```javascript
var SepaXML = require('sepa-xml');
var credit = SepaXML.createCredit(); // takes a single argument which is the version, default is 'pain.001.001.03'

// This sets the header data in the file
credit.setHeaderInfo({
  id: '123/1',
  method: 'TRF',
  batchBooking: false
});

// Create payment batch
var payment = new credit.createPayment({
  id: 'XYZ987',
  method: 'TRF'
});

// Add transaction
payment.addTransaction({
  id: 'endToEndID',
  iban: 'NL21ABNA0531621583',
  name: 'generateiban',
  amount: 42
});

// add payment to credit
credit.addPayment(payment);

credit.compile(function (err, out) {
  // your XML data gets output here
});
```
