chrome.runtime.onMessage.addListener(async(request, sender, sendResponse)=>{
  // if (request.message === 'check cookies'){
  //   console.log('Checking linkedin and peaku cookies');
  //   validateLinkedinCookies();
  // } 
  console.log(`Mensaje recibido en el background -> ${request.message}`);
})