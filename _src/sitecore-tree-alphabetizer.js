function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == "string", "tab.url should be a string");

    callback(url);
  });
}

function sortTree(url) {
  console.log("processing:" + url);
  var script = "";
  script += "var items = document.getElementsByClassName('scContentTreeNode');"
  script += "items = Array.prototype.slice.call(items);"
  script += `items.sort(function(a, b){
    return a.textContent.localeCompare(b.textContent);
  });`
  script += `for(var i = 0, r = items.length; i < r; i++) {
    var parent = items[i].parentNode;
    var detachedItem = parent.removeChild(items[i]);
    parent.appendChild(detachedItem);
  }`

  chrome.tabs.executeScript({
    code: script,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getCurrentTabUrl((url) => {
    sortTree(url);
  });
});
