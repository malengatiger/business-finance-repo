"use strict";
// The content of this file was generated by IBM Cloud
// No not modify it as it might get overridden
var IBMCloudEnv = require('ibm-cloud-env');
var serviceManager = require('./service-manager');
IBMCloudEnv.init();
module.exports = function (app) {
    require('./service-cloudant')(app, serviceManager);
};
//# sourceMappingURL=index.js.map