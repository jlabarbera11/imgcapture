import $ from "jquery";
import domtoimage from 'dom-to-image';
import fileSaver from 'file-saver';
import '../css/contentscript.css';

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
		switch (msg.type) {
			case "addBindings":
        $("body *").on("mouseover.cc", (e) => {
          e.target.classList.add("imgcapture-mouseover");
				});

				$("body *").on("mouseout.cc", (e) => {
          e.target.classList.remove("imgcapture-mouseover");
				});

				$("body *").on("click.cc", function(e) {
					e.stopPropagation();

          e.target.classList.remove("imgcapture-mouseover");
					domtoimage.toBlob(e.target).then((blob) => {
						fileSaver.saveAs(blob, 'my-node.png');
					});

					port.postMessage({type: "disablePlugin"});
        });

        $(document).keyup(function(e) {
          if (e.which === 27) { // esc
            $('.imgcapture-mouseover').removeClass('imgcapture-mouseover');
            port.postMessage({type: "disablePlugin"});
          }
        });
				break;
      case "removeBindings":
				$("body *").off(".cc");
				break;
			}
	});
});
