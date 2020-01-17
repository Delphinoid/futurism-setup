(function(){
    
    'use strict';

    var RecordGoose = require('../shared/models/Record');
    var continueSession = require('../middleware/continueSession');


    var self = {
        
        init: function(expr) {
            expr.get('/api/records/:recordId', continueSession, self.get);
            expr.get('/api/records', continueSession, self.getList);
        },
        
        
        get: function(req, res) {
            RecordGoose.findById(req.params.recordId, res.apiOut);
        },
        
        
        getList: function(req, res) {
            RecordGoose.find({}, {}, {sort: {time: -1}}).limit(10).exec(res.apiOut);
        }
        
    };

    module.exports = self;

}());