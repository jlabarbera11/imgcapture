import "../../icon.png";
import "../../icon_stop.png";

let running = false;
let ports = {};

var createPort = (tabId) => {
  let port = chrome.tabs.connect(tabId, {name: "port"});
  port.onMessage.addListener((msg) => {
    if (msg.type === "removeBindings") {
      removeBindings(tabId);
    }
  });
  port.onDisconnect.addListener(() => {
    delete ports[tabId];
  });

  ports[tabId] = port;
}

var addBindings = (tabId) => {
  ports[tabId].postMessage({type: "addBindings"});

  chrome.browserAction.setIcon({
      path: 'icon_stop.png',
      tabId: tabId
  });
  running = true;
}

var removeBindings = (tabId) => {
  ports[tabId].postMessage({type: "removeBindings"});

  chrome.browserAction.setIcon({
      path: 'icon.png',
      tabId: tabId
  });
  running = false;
}

chrome.browserAction.onClicked.addListener((tab) => {
  if (!ports[tab.id]) {
    createPort(tab.id);
  }

  if (!running) {
    addBindings(tab.id);
  } else {
    removeBindings(tab.id);
  }
});
