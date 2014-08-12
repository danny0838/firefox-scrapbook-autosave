function sbAutoSave_onPopupShowing()
{
    var enabled = sbAutoSaveCommon.getBoolPref("enabled", true);
    document.getElementById("sbAutoSaveMenu").setAttribute("checked", enabled);
}

function sbAutoSave_toggle(aEnable)
{
    sbAutoSaveCommon.setBoolPref("enabled", aEnable);
}