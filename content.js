console.log("hi ive been injected");

var recorder = null;
function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = function (event) {
    let recordedBlob = event.data;

    // Convert Blob to Base64
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64Data = reader.result.split(",")[1]; // Extract Base64 data (remove the data:image/...;base64, prefix)

      // Convert Base64 to ArrayBuffer
      const binaryString = atob(base64Data);
      const length = binaryString.length;
      const arrayBuffer = new ArrayBuffer(length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      // Now, you have both the Base64 and ArrayBuffer representations
      console.log("Base64 Data:", base64Data);
      console.log("ArrayBuffer:", arrayBuffer);

      // Continue with any other processing or send the data to your backend
      sendToBackend(arrayBuffer);
    };

    reader.readAsDataURL(recordedBlob);

    let url = URL.createObjectURL(recordedBlob);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    console.log(url);
    a.download = "screen-recording.webm";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 9999999999,
          height: 9999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (message.action === "stopvideo") {
    console.log("stopping video");
    sendResponse(`processed: ${message.action}`);
    if (!recorder) return console.log("no recorder");

    recorder.stop();
  }
});
