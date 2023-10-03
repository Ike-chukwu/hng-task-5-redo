document.addEventListener("DOMContentLoaded", ()=>{
    // GET THE SELECTORS OF THE BUTTONS
    const startScreenRecordingButton = document.querySelector(".start")
    // const stopScreenRecordingButton = document.querySelector("button#stop_video")
    const recordingPanel = document.querySelector(".recordingPanel");
    // adding event listeners

    startScreenRecordingButton.addEventListener("click", ()=>{
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "request_recording"},  function(response){
                if(!chrome.runtime.lastError){
                    console.log(response)
                } else{
                    console.log(chrome.runtime.lastError, 'error line 14')
                }
            })
        } )
    })


    // stopScreenRecordingButton.addEventListener("click", ()=>{
    //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    //         chrome.tabs.sendMessage(tabs[0].id, {action: "stopvideo"},  function(response){
    //             if(!chrome.runtime.lastError){
    //                 console.log(response)
    //             } else{
    //                 console.log(chrome.runtime.lastError, 'error line 27')
    //             }
    //         })
    //     } )
    // })
})