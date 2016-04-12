// Improvements:
// 1. A regular expression can be specified so that URLs matching this RE aren't captured.
// 2. Captured pages are arranged in two-levels of directories: months and days, instead of just days.
// 3. URLs already captured in the current browser session aren't captured again.
// 4. Option to suppress error alerts when auto-saving.

var sbAutoSaveService = {

    CapturedURLs : {},

    init : function()
    {
        gBrowser.addEventListener("load", function(aEvent){
            if ( !sbAutoSaveUtils.getBoolPref("enabled", true) ) {
                return;
            }

            var win = aEvent.originalTarget.defaultView;
            if ( win != win.top ) {
                return;
            }

            var delay = sbAutoSaveUtils.getIntPref("delay", 0);
            if (delay) {
                setTimeout(function () {
                    sbAutoSaveService.capturePage(win);
                }, delay);
            } else {
                sbAutoSaveService.capturePage(win);
            }
        }, true);
    },

    capturePage : function(win)
    {
        var url = win.location.href;
        var idx = url.indexOf('#');
        if (idx >= 0) {
            url = url.slice(0, idx);
        }

        if ( url in this.CapturedURLs ) {
            return;
        }
        if ( url.indexOf("http") !== 0 ) {
            return;
        }

        var included = sbAutoSaveUtils.copyUnicharPref("include", "").match(/\S/) ? false : true;
        sbAutoSaveUtils.copyUnicharPref("include", "").split("\n").forEach(function(include){
            if (!include) return;
            try {
                var regex = new RegExp(include, "i");
                if (win.location.href.search(regex) >= 0) {
                    included = true;
                }
            } catch(ex) {}
        }, this);
        if (!included) return;

        var excluded = false;
        sbAutoSaveUtils.copyUnicharPref("exclude", "").split("\n").forEach(function(exclude){
            if (!exclude) return;
            try {
                var regex = new RegExp(exclude, "i");
                if (win.location.href.search(regex) >= 0) {
                    excluded = true;
                }
            } catch(ex) {}
        }, this);
        if (excluded) return;

        var ts = sbAutoSaveCommon.getTimeStamp();
        var monthStamp = ts.substring(0,6) + "00000000";
        var DirURI = "urn:scrapbook:item" + monthStamp;
        var fItem, fRes;
        if ( !sbAutoSaveData.exists(sbAutoSaveCommon.RDF.GetResource(DirURI)) )
        {
            fItem = sbAutoSaveUtils.newItem(monthStamp);
            monthStamp.match(/^(\d{4})(\d{2})\d{8}$/);
            fItem.title = RegExp.$1 + "/" + RegExp.$2;
            fItem.type = "folder";
            fRes = sbAutoSaveData.addItem(fItem, "urn:scrapbook:root", 0);
            sbAutoSaveData.createEmptySeq(fRes.Value);
        }

        var timeStamp = ts.substring(0,8) + "000000";
        var targetURI = "urn:scrapbook:item" + timeStamp;
        if ( !sbAutoSaveData.exists(sbAutoSaveCommon.RDF.GetResource(targetURI)) )
        {
            fItem = sbAutoSaveUtils.newItem(timeStamp);
            timeStamp.match(/^(\d{4})(\d{2})(\d{2})\d{6}$/);
            fItem.title = (new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10) - 1, parseInt(RegExp.$3, 10))).toLocaleDateString();
            fItem.type = "folder";
            fRes = sbAutoSaveData.addItem(fItem, DirURI, 0);
            sbAutoSaveData.createEmptySeq(fRes.Value);
        }

        var presetData = [
            null,
            null,
            {
                "images" : sbAutoSaveUtils.getBoolPref("images", true),
                "media" : sbAutoSaveUtils.getBoolPref("images", true),
                "fonts" : sbAutoSaveUtils.getBoolPref("fonts", true),
                "frames" : sbAutoSaveUtils.getBoolPref("frames", true),
                "styles" : sbAutoSaveUtils.getBoolPref("styles", true),
                "script" : sbAutoSaveUtils.getBoolPref("script", false)
            },
            null,
            null
        ];

        if (sbAutoSaveUtils.getBoolPref("ignore", false)) {
            var sv = window.alert;
            try {
                window.alert = function(s){ return s; };
                sbContentSaver.captureWindow(win, false, false, targetURI, 0, presetData, null);
            }
            finally {
                window.alert = sv;
            }
        } else {
            sbContentSaver.captureWindow(win, false, false, targetURI, 0, presetData, null);
        }

        this.CapturedURLs[url] = true;
    }
};

window.addEventListener("load", sbAutoSaveService.init, false);
