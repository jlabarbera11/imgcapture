import "../../icon.png";

let running = false;
let ports = {};

var createPort = (tabId) => {
  let port = chrome.tabs.connect(tabId, {name: "port"});
  port.onMessage.addListener((msg) => {
    if (msg.type == "removeBindings") {
      removeBindings();
    }
  });
  port.onDisconnect.addListener(() => {
    delete ports[tabId];
  });

  ports[tabId] = port;
}

var addBindings = (tabId) => {
  ports[tabId].postMessage({type: "addBindings"});
  running = true;
}

var removeBindings = (tabId) => {
  ports[tabId].postMessage({type: "removeBindings"});
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
