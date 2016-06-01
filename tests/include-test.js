var etcdClientMod = require('./dist/etcd-client');

if(etcdClientMod.etcd == undefined){
    throw new Error('Unable to properly import module.');
}

var testObj = new etcdClientMod.etcd('testing');

if(testObj == undefined){
    throw new Error('Unable to create new etcd class.');
} 

console.log('Test successful.');