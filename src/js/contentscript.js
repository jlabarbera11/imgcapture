import $ from "jquery";
import domtoimage from 'dom-to-image';
import fileSaver from 'file-saver';
import '../css/contentscript.css';

const attr = 'data-original-background-color';

let targets = {};

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
		switch (msg.type) {
			case "addBindings":
				$("body *").on("mouseover.cc", (e) => {
					if (!e.target.attributes[attr]) {
						e.target.setAttribute(attr, e.target.style.backgroundColor);
					}
          e.target.style.backgroundColor = "#A0C6E8";
          targets[e.target] = true;
				});

				$("body *").on("mouseout.cc", (e) => {
					e.target.style.backgroundColor = e.target.attributes[attr].value;
          delete targets[e.target];
				});

				$("body *").on("click.cc", function(e) {
					e.stopPropagation();

					e.target.style.backgroundColor = e.target.attributes[attr].value;
					domtoimage.toBlob(e.target).then((blob) => {
						fileSaver.saveAs(blob, 'my-node.png');
					});

					port.postMessage({type: "removeBindings"});
        });

        $(document).keyup(function(e) {
          if (e.which === 27) { // esc
            port.postMessage({type: "removeBindings"});
          }
        });
				break;
      case "removeBindings":
        for (var target in targets) {
          debugger;
          target.style.backgroundColor = target.attributes[attr].value;
        }
        targets = {};

				$("body *").off(".cc");
				break;
			}
	});
});
