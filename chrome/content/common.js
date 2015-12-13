(function(){
    var PREF = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.scrapbook.addon.autosave.");

    window.sbAutoSaveUtils = {
        getBoolPref : function(aName, aDefaultValue)
        {
            try {
                return PREF.getBoolPref(aName);
            } catch(ex) {
                return aDefaultValue;
            }
        },

        setBoolPref : function (aName, aValue)
        {
            PREF.setBoolPref(aName, aValue);
        },

        copyUnicharPref : function(aName, aDefaultValue)
        {
            try {
                return PREF.getComplexValue(aName, Components.interfaces.nsISupportsString).data;
            } catch(ex) {
                return aDefaultValue;
            }
        },
        
        newItem : function(aID)
        {
            if (sbAutoSaveCommon.newItem) return sbAutoSaveCommon.newItem(aID);
            return { id : aID || "", type : "", title : "", chars : "", icon : "", source : "", comment : "" };
        },
    };

    window.sbAutoSaveCommon = ("ScrapBookUtils" in window) ? ScrapBookUtils : sbCommonUtils;
    window.sbAutoSaveData = ("ScrapBookData" in window) ? ScrapBookData : sbDataSource;
})();
