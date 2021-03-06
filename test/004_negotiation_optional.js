var telnet = process.env.NODETELNETCLIENT_COV 
  ? require('../lib-cov/telnet-client')
  : require('../lib/telnet-client')
var nodeunit = require('nodeunit')
var telnet_server = require('telnet')

var srv

exports['negotiation_optional'] = nodeunit.testCase({
  setUp: function(callback) {
    srv = telnet_server.createServer(function(c) {
      c.on('data', function() {
        c.write(new Buffer("Hello, user.\n"))
      })
    })
    
    srv.listen(2323, function() {
      callback()
    })
  },

  tearDown: function(callback) {
    srv.close(function() {
      callback()
    })
  },

  send_data: function(test) {
    var connection = new telnet()

    var params = {
      host: '127.0.0.1',
      port: 2323,
      negotiationMandatory: false
    }

    connection.on('connect', function() {
      connection.send('Hello, server.', {
        ors: '\r\n',
        waitfor: '\n'
      }, function(error, data) {
        test.strictEqual(data.toString(), 'Hello, user.\r\n')
        test.done()
        connection.end()
      })
    })
    
    connection.connect(params);
  }
})
