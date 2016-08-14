
if(global._scouternode) return global._scouternode;

var fs = require('fs');
var os = require('os');
var util = require('util');
var path = require('path');
var events = require('events');
var cluster = require('cluster');

var logType = {
  Log: 'Log',
  Info: 'Info',
  Warning: 'Warning',
  Error: 'Error'
};

// Mapping of log type to default console logger
var logFunctions = {
  Log: console.log,
  Info: console.info,
  Warning: console.warn,
  Error: console.error
};

var ScouterNode = function() {
  this.version = '0.1.0';
  this.master = cluster.isMaster;

  this.logType = logType;

  events.EventEmitter.call(this);
};

util.inherits(ScouterNode, events.EventEmitter);
exports = module.exports = global._scouternode = new ScouterNode();

ScouterNode.prototype.profile = function(opt) {
  var self = this;

  if(!opt) opt = {};

  this.token = opt.token;
  this.stdout = opt.stdout;
  this.debug = opt.debug;
  this.disabledProbes = typeof opt.disabledProbes === 'undefined' ? {} : opt.disabledProbes;

  if(this.stdout) {
    this.on('sample', function(sample) {
      console.log(indent({sample: sample}));
    });
  }

  // preparing probes
  var probes = {}; //.js를 제외한 /probes에 있는 파일명을 속성으로 하는 object
  var files = fs.readdirSync(path.dirname(require.resolve('./scouter-nodejs')) + '/probes');
  files.forEach(function(file) {
    var m = file.match('^(.*)+\.js$');
    if(m && m.length == 2) probes[m[1]] = true;
  });

  var proxy = require('./proxy');

  //module.require method 변경
  proxy.after(module.__proto__, 'require', function(obj, args, ret) {
    if(ret.__scoutered__) return;

    var builtin = true;
    if(!args[0].match(/^[^\/\\]+$/)) {
      builtin = false;
    }

    //builtin이 아닌경우 "arg[0].probe"파일이 존재하면 해당 probe를 리턴
    if(!builtin) {
      path.exists(args[0] + '.probe', function(exists) {
        if(exists) {
          ret.__scoutered__ = true;
          require(args[0] + '.probe')(ret);
        }
      });
    }
      //builtin인 경우 기 제공하는 probes/xxx를 사용함
    else if(probes[args[0]] && !self.disabledProbes[args[0]]) {
      ret.__scoutered__ = true;
      require('./probes/' + args[0])(ret);
    }
  });

}

ScouterNode.prototype.log = function(msg) {
  if(this.debug && msg) console.log('scouternode:', msg);
};

ScouterNode.prototype.error = function(e) {
  if(this.debug && e) console.error('scouternode error:', e, e.stack);
};

ScouterNode.prototype.dump = function(obj) {
  if(this.debug) console.log(util.inspect(obj, false, 10, true));
};

function indent(obj, depth) {
  if(!depth) depth = 0;
  if(depth > 20) return '';

  var tab = '';
  for(var i = 0; i < depth; i++) tab += "\t";

  var str = ''
  var arr = Array.isArray(obj);

  for(var prop in obj) {
    var val = obj[prop];
    if(val == undefined || prop.match(/^_/)) continue;

    var label = val._label || (arr ? ('[' + prop + ']') : prop);

    if(typeof val === 'string' || typeof val === 'number') {
      str += tab + label + ': \033[33m' + val + '\033[0m\n';
    }
    else if(typeof val === 'object') {
      str += tab + '\033[1m' + label + '\033[0m\n';
      str += indent(val, depth + 1);
    }
  }

  return str;
}