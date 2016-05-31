declare var require;

var debug = require('debug')('alapi:etcd');
var http = require('http');
var Promise = require('bluebird');

export interface EtcdRequestObject{
     key: string;
     method: string;
     params: string;
     body: any;
};

export interface EtcdResponseObj{
     status: number;
     body: any;
     headers: any;
};

export class etcd{


    // private var etcdHost : string;
    // private var etcdPort : number = 2379;

    constructor(private etcdHost: string, private etcdPort: number = 2379){};


    /**
     * This method will issue a request to EtcD and return the response.
     */
    public request(reqObj: EtcdRequestObject){
         
         return new Promise((resolve, reject)=>{
              
              //Build a request to see if the key has been set
              var connectOptions = {
                   protocol: 'http:',
                   method: reqObj.method,
                   host: this.etcdHost,
                   port: this.etcdPort,
                   path: '/v2/keys' + reqObj.key + reqObj.params
              }
              
              if(reqObj.method != "GET" && reqObj.body != undefined){
                   connectOptions['headers'] = {
                        "Content-Type" : "application/x-www-form-urlencoded"
                   }
              }
              
              var clientReq = http.request(connectOptions);
              
              
              clientReq.on('response', (incomingMesage)=>{
                   debug('The etcd service has responded to our initial query.');
                   
                   
                   var responseData = ''; 
                   incomingMesage.on('data', (incomingData)=>{
                        debug('Etcd response data received.');
                        responseData += incomingData;
                   });
                   
                   incomingMesage.on('end', ()=>{
                        debug('Etcd response finished reading.')
                        debug('Incoming message body: %s', responseData.toString());
                        
                        try {
                             var parsedBody = JSON.parse(responseData);
                             
                             var responseObj: EtcdResponseObj = {
                                  status : incomingMesage.statusCode,
                                  body : parsedBody,
                                  headers : incomingMesage.headers
                             };
                             
                             resolve(responseObj);
                             
                        } catch (error) {
                             reject(error);
                        }
                        
                        
                   })
                   
                   incomingMesage.on('error', (err)=>{
                       debug('There was an error returned from the etcd request.  ' + err);
                   });
                   
              });
              
              if(reqObj.method != 'GET' && reqObj.body != undefined){
                  debug('Adding data to request body.');
                  clientReq.write(reqObj.body);
              }
              
              clientReq.end();
              
         });
     
    }

}

