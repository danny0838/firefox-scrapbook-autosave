function sbAutoSave_onPopupShowing()
{
    var enabled = sbCommonUtils.getBoolPref("scrapbook.autosave.enabled", true);
    document.getElementById("sbAutoSaveMenu").setAttribute("checked", enabled);
}

function sbAutoSave_toggle(aEnable)
{
    sbCommonUtils.setBoolPref("scrapbook.autosave.enabled", aEnable);
}