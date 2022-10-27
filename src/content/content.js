//*--------------------------------------------------------------------------------------
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
//*--------------------------------------------------------------------------------------




//*--------------------------------------------------------------------------------------
const getPageVacancies = async() =>{
  let vacanciesContainer = document.querySelector('div.jobs-search-results-list');
  vacanciesContainer.scrollTo({
    top: 5000,
    left: 0,
    behavior: 'smooth'
  });
  await sleep(1500);
  let pageVacancies = document.querySelectorAll('div.job-card-container');
  return pageVacancies;
};
//*--------------------------------------------------------------------------------------




//*--------------------------------------------------------------------------------------
// This function will scrap throuhg each job and return the job data like a object with many properties
const getJobDetails = async(pageVacancies,i) =>{
  let vacancie = pageVacancies[i];
  let jobId = vacancie.getAttribute('data-job-id');
  document.querySelector(`div[data-job-id='${jobId}']`).click();
  await sleep(1000);
  let howLong = document.querySelector('span.jobs-unified-top-card__posted-date').innerText;
  document.querySelector('div.jobs-search__job-details--container').scrollTo({
    top: 5000,
    left: 0,
    behavior:'smooth'
  });
  await sleep(1000);
  let companyLink = document.querySelector('div.artdeco-entity-lockup__title a.link-without-visited-state');
  if(companyLink){
    companyLink = companyLink.href;
    companyLink = companyLink.replace('life','people');
    companyLink += '?keywords=recruitment%2Chuman%2Cseleccion%2Chumanos%2Creclutamiento%2Crecruiter';
  }
  else{
    companyLink = 'None';
  }
  let description = document.querySelector('div.jobs-box__html-content').innerText;
  description = description.split('\n');
  description.forEach((value,index) => {
    if(value == ''){
      description.splice(index,1);
    }
  });
  let jobLink = document.querySelector(`div[data-job-id='${jobId}'] div div a`).href;
  let title = document.querySelector(`div[data-job-id='${jobId}'] div div div.artdeco-entity-lockup__title`).innerText;
  let company = document.querySelector(`div[data-job-id='${jobId}'] div div div.artdeco-entity-lockup__subtitle`).innerText;
  let companyLogo = document.querySelector(`div[data-job-id='${jobId}'] div div a div div img`);
  if(companyLogo){
    companyLogo = companyLogo.src;
  }
  else{
    companyLogo = 'None';
  }
  let location = document.querySelector(`div[data-job-id='${jobId}'] div div div.artdeco-entity-lockup__caption`).innerText;
  let obj = {
    jobId,
    jobLink,
    title,
    company,
    companyLogo,
    location,
    howLong,
    description,
    companyLink
  }
  return obj;
};
//*--------------------------------------------------------------------------------------




//*--------------------------------------------------------------------------------------
// This function will scrap the linkedin page
const scrapJobsVacancies = async(limit) => {
  let vacancies = [];

  while (true) {
    
    //Return a nodeList
    let pageVacancies = await getPageVacancies();

    // With this loop, we are scrap the cards of the jobs and collect the main data
    for(let i=0;i<pageVacancies.length;i++) {

      // Condition to break the loop
      if(vacancies.length >= limit){
        break;
      };

      // get the job information
      let job = await getJobDetails(pageVacancies,i); //Return a object with many properties(job details)
      
      // Let's introduce the job in the array
      vacancies.push(job);
    };
    
    // Now we need to press the next button of the page
    let page = document.querySelector('ul.artdeco-pagination__pages li.selected').innerText;
    page = Number(page);
    let nextPage = document.querySelector(`ul.artdeco-pagination__pages li[data-test-pagination-page-btn='${page+1}'] button`);
    if(nextPage && vacancies.length < limit){
      nextPage.click();
      await sleep(2000);
    }
    else{
      break;
    }

  };
  return vacancies;
};
//*--------------------------------------------------------------------------------------



//*--------------------------------------------------------------------------------------
// This function will scraping the linkedin company page 
const scrapCompanyPage = async (vacancie)=>{
  await sleep(1000);
  // while(true){
  //   let initialScrollHeight = document.body.scrollHeight;
  //   window.scrollTo({top: initialScrollHeight, left: 0, behavior:'smooth'});
  //   await sleep(1000);
  //   let finallyScrollHeight = document.body.scrollHeight;
  //   if(finallyScrollHeight === initialScrollHeight){
  //     break;
  //   }
  // }
  // let input = document.querySelector('input#people-search-keywords');
  // console.log(input);
  while(true){

    let foundPeople = document.querySelectorAll('section.org-people-profile-card');
    console.log(foundPeople);
    if(foundPeople.length == 0){
      let changeFilter = document.querySelector('div.org-people__insights-container div div ul li button');
      console.log('Ejecucion');
      console.log(changeFilter);
    }
    break;
  };
  return 'Hola primo'
};
//*--------------------------------------------------------------------------------------




//*--------------------------------------------------------------------------------------
// Message listener, there is the main logic
chrome.runtime.onMessage.addListener(async(request, sender, sendResponse)=>{
  
  if(request.message == 'init scrap'){
    let vacancies = await scrapJobsVacancies(request.limit);
  
    chrome.runtime.sendMessage({
      "message": "analyze companies",
      "vacancies": vacancies
    });
    
  }

  
  if(request.message == 'scrap company'){

    let vacancie = request.vacancie;
    let reult = await scrapCompanyPage(vacancie);
    console.log(vacancie);
  }
  
});
//*--------------------------------------------------------------------------------------