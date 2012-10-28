KISSY.app('B');
B.namespace('waterfall_demo');
B.waterfall_demo = (function() {
    var S = KISSY, 
        D = S.DOM, 
        E = S.Event,
        _A = S.all,
        _O = S.one;
        //waterfallTemplate = D.get('#waterfall_tpl').innerHTML;
    return {
        init: function() {
            
        },
        _requestAllData: function() {
            var self = this;
            S.ajax({
                url: self.config.getListUrl,
                dataType: 'json',
                data: dataArguments,
                success: function(data) {
                    self.message = data;//¸ø_statusSwitch±¸ÓÃ
                    callback(idx);
                }
            });
        }
        
    }
})();
