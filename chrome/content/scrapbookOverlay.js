function sbAutoSave_onPopupShowing()
{
    var enabled = sbAutoSaveUtils.getBoolPref("enabled", true);
    document.getElementById("sbAutoSaveMenu").setAttribute("checked", enabled);
}

function sbAutoSave_toggle(aEnable)
{
    sbAutoSaveUtils.setBoolPref("enabled", aEnable);
}