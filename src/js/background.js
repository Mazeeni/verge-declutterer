var filterParams;

browser.menus.create({
  id: "filter_element",
  title: "Add Element to Filter",
  documentUrlPatterns: ["https://*/*", "http://*/*"],
  contexts: [
    "audio",
    "editable",
    "frame",
    "image",
    "link",
    "page",
    "password",
    "video",
  ],
});

browser.menus.onClicked.addListener(async (info, tab) => {
  filterParams = {
    tabId: tab.id,
    frameId: info.frameId,
    targetElementId: info.targetElementId,
  };
  browser.pageAction.show(tab.id);
  await browser.pageAction.openPopup();
  await browser.pageAction.hide(tab.id);
});

browser.runtime.onMessage.addListener(async (msg) => {
  if (msg === "getFilterParams") {
    return filterParams;
  }
});

// check if page has an active profile on it
async function newPageOpened(tabId) {
  const tab = await browser.tabs.get(tabId);
  const tabHostname = new URL(tab.url).hostname.replace(/^(www\.)/, "");
  const storageName = "profilesFor" + tabHostname;
  const allProfileGroups = await browser.storage.local.get(storageName);
  console.log(allProfileGroups);

  if (Object.entries(allProfileGroups).length !== 0) {
    const currProfileGroup = allProfileGroups[Object.keys(allProfileGroups)[0]];
    console.log(currProfileGroup);
    for (const key in currProfileGroup) {
      if (
        tab.url.includes(currProfileGroup[key].url) &&
        currProfileGroup[key].isModeOn
      ) {
        // ready to apply profile to page.
      }
      // go thru profiles and look for active one
      // otherwise default to first profile
    }
  }

  // gettingTab.then((t) => {
  //   const urlDomain = new URL(t.url);
  //   browser.tabs.get;
  // });
  console.log(tab.url);
}

browser.tabs.onUpdated.addListener(newPageOpened, { properties: ["url"] });
