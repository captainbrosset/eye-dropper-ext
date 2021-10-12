// Browser compat.
const browser = window.browser || chrome;

let ed = null;

browser.browserAction.onClicked.addListener(async () => {
    if (!('EyeDropper' in window)) {
        alert('Sorry, your browser does not support the EyeDropper API which this extension uses');
        return;
    }

    if (!ed) {
        ed = new EyeDropper();
    }

    try {
        const result = await ed.open();
        console.log(result);
    } catch (e) {
        // Silently fail, the user may have escaped the eyedropper mode.
        debugger;
    }
});
