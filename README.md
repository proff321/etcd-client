etcd-client
===

Overview
---
The purpose of this module is to allow a developer to communicate with an etcd service in a promisified fashion.

Getting Started
---
After installing the module, include it as part of your Typescript or Javascript project.

The module exposes a class `etcd` and two Typescript interfaces `EtcdRequestObject` and `EtcdResponseObj`.  To get started, create a new `etcd` object passing it a hostname and optional port.  The default value for port is `2379`.  

    // Typescript inclusion
    import {etcd} from 'etcd-client'
    let etcdService = new etcd('10.0.0.12');
    
    // Javascript
    var etcdModule = require('etcd-client');
    var etcdService = new etcdModule.etcd('10.0.0.12');
    
To send a request off to the service use the `request()` method of the `etcd` class.  The `request` method takes a type `EtcdRequestObject`.

    interface EtcdRequestObject{
        key: string;
        method: string;
        params: string;
        body: any;
    }

Parameter | Description 
---|---
`body` | The data which is passed as part of the HTTP request to the etcd service.
`method` | The HTTP verb (GET, POST, etc.).
`params` | A URL encoded set of GET properties to append to the request URL.
`body` | The data to pass along with the HTTP request.

The `request` method will then build a new HTTP request with the provided information and return a promise that will resolve when a response is returned from the etcd service.  The promise will not resolve until all data is received.  In other words, this method takes care of monitoring all of the NodeJS specific socket and buffer events.

    var reqParams = {..};
    etcdService.request(reqParams)
        .then(result => { // Process response. });

The result of the promise will be of type `EtcdResponseObj`.

    interface EtcdResponseObj{
        status: number;
        body: any;
        headers: any;
    };

Parameter | Description 
---|---
`status` | The HTTP status number recieved from the etcd service response.
`body` | The body of the etcd service response.
`headers` | The headers returned form the etcd service.

Ideas & Contributions
---
As a next step in development it would be really nice to create helper methods that model the etcdctl commands.  If you have an idea of what could improve this module please post it as an issue on the [github repo](https://github.com/proff321/etcd-client).
