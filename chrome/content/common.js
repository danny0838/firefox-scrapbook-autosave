var sbAutoSaveCommon = {

    checkCompatibility : function()
    {
        return ("sbCommonUtils" in window) && ("newItem" in sbCommonUtils);
    },

    getBoolPref : function(aName, aDefaultValue)
    {
        return sbCommonUtils.getBoolPref("extensions.scrapbook.addon.autosave." + aName, aDefaultValue);
    },

    setBoolPref : function (aName, aValue)
    {
        sbCommonUtils.setBoolPref("extensions.scrapbook.addon.autosave." + aName, aValue);
    },

    copyUnicharPref : function(aName, aDefaultValue)
    {
        return sbCommonUtils.copyUnicharPref("extensions.scrapbook.addon.autosave." + aName, aDefaultValue);
    },
};