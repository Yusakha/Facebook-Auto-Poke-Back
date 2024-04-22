
function readPage() {
    var aTags = document.getElementsByTagName("span");
    // var regex = /times\s+in\s+a\s+row!/;s
    var searchText = "Poke Back";
    var found;
    var next = false;

    for (var i = 0; i < aTags.length; i++) {
        // if (regex.test(aTags[i].textContent)) {
        //     const contents = aTags[i].textContent;
        //     const content = contents.replace(/,/g,'');
        //     const nameFL = content.replace(/ poked you \d+ times in a row!/, '');
        //     const pokedCount = parseInt(content.match(/\d+/)[0]);
        //     console.log(nameFL+" "+pokedCount);
        // } else
        if (aTags[i].textContent == searchText) {
            if (next) {
                next = false;
                continue;
            } else {
                next = true;
                found = aTags[i];
                found.click();
                console.log("Poked...");
            }
        }
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("poke", {
        delayInMinutes: 0,
        periodInMinutes: 0.1
    });
});

// chrome.runtime.onInstalled.addListener(() => {
//     chrome.alarms.create("reload", {
//         delayInMinutes: 0,
//         periodInMinutes: 4
//     });
// });

chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.tabs.query({ url: "https://www.facebook.com/pokes/*"  }, function (tabs) {
        if (alarm.name === "poke" && tabs.length >= 1) {
            {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: readPage
                });
            }
        // } else if (alarm.name === "reload"){
        //     chrome.tabs.reload(tabs[0].id);
        }
    });
});

chrome.action.onClicked.addListener((tab) => {
    if (!tab.url.includes("chrome://")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: readPage
        });
    }
});