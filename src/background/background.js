//*----------------------------------------------------------------------------------------------------------
// This function return and resolve a promise after some seconds(you need specify how many secons by parameters). This is necesary for the comunication with the contents scripts
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
//*----------------------------------------------------------------------------------------------------------




//*----------------------------------------------------------------------------------------------------------
// This function returns a the user's current tab (javascript obj)
const getCurrentTab = async() => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};
//*----------------------------------------------------------------------------------------------------------





//*----------------------------------------------------------------------------------------------------------
// This function will to generate the url to scrap in linkedin(using the users input, like contry)
const getUrlToScrap = (role,contry) =>{
  let generateUrl = `https://www.linkedin.com/jobs/search/?currentJobId=3323312640&geoId=${contry}&keywords=${role}&refresh=true`;
  return generateUrl;
}
//*----------------------------------------------------------------------------------------------------------



// //*----------------------------------------------------------------------------------------------------------
// // This function will through the vacancies array, request the companyLink and analyze the company page
// const scrapCompanies = async (vacancies)=>{
//   for(let vacancie of vacancies){
//     if(vacancie.companyLink != 'None'){
//       console.log(vacancie.companyLink);
//     }
//   };
// };
// //*----------------------------------------------------------------------------------------------------------



//*----------------------------------------------------------------------------------------------------------
// This is the onMessage listenner. This the main logic
chrome.runtime.onMessage.addListener(async(request, sender, sendResponse)=>{
  
  // If the message is 'search vacancies' is received, the content script will init to scrap the page (the user must have the linkedin credential and need to be on the linkedin page)
  if(request.message == 'search vacancies'){
    
    // We need to get the current tab
    let ActiveTab = await getCurrentTab();

    let urlToScrap = getUrlToScrap(request.role,request.contry);

    // Now update the url
    await chrome.tabs.update(request.activeTabId, { url: urlToScrap });
    console.log('Now we are scraping the linkedin page') 
    await sleep(5000);
    chrome.tabs.sendMessage(ActiveTab.id,{
      "message":"init scrap",
      "limit":request.limit
    });
  };

  // Analyze the companies page on linkedin
  if(request.message === 'analyze companies'){

    // Contents scripts send an array wiht many object. Each object has somoe properties with information about the vacancies in linkedin
    let vacancies = request.vacancies;

    
    let currentTab = await getCurrentTab();

    // So now, our scraper need to iter through the array
    for(let vacancie of vacancies){

      // Some vacancies don't have company page, and we need avoid errors
      if(vacancie.companyLink != 'None'){

        // Update the user tab url
        await chrome.tabs.update(currentTab.id, { url:vacancie.companyLink});
        await sleep(4000);

        // Send a message to the contents scrips, and will begin to scraping each company page
        chrome.tabs.sendMessage(currentTab.id,{ 
          "message":"scrap company",
          "vacancie": vacancie
        });

        await sleep(10000);

      }
    }

    console.log(vacancies);
  }
});
//*----------------------------------------------------------------------------------------------------------