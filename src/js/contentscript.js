import $ from "jquery";
import domtoimage from 'dom-to-image';
import fileSaver from 'file-saver';

const attr = 'data-original-background-color';

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
		switch (msg.type) {
			case "addBindings":
				$("body *").on("mouseover.cc", (e) => {
					if (!e.target.attributes[attr]) {
						e.target.setAttribute(attr, e.target.style.backgroundColor);
					}
					e.target.style.backgroundColor = "#A0C6E8";
				});

				$("body *").on("mouseout.cc", (e) => {
					e.target.style.backgroundColor = e.target.attributes[attr].value;
				});

				$("body *").on("click.cc", function(e) {
					e.stopPropagation();

					e.target.style.backgroundColor = e.target.attributes[attr].value;
					domtoimage.toBlob(e.target).then((blob) => {
						fileSaver.saveAs(blob, 'my-node.png');
					});

					port.postMessage({type: "removeBindings"});
				});
				break;
			case "removeBindings":
				$("body *").off(".cc");
				break;
			}
	});
});
