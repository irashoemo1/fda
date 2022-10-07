document.querySelector('#byReason').addEventListener('click', byReason)
document.querySelector('#byEffect').addEventListener('click', byEffect)
let pageChangeBtns = document.querySelectorAll('.page-changer')
pageChangeBtns.forEach( btn => {
    btn.addEventListener('click', changePage)
})

const address = document.querySelector('.address')
const city = document.querySelector('.city')
const country = document.querySelector('.country')
const classification = document.querySelector('.classification')
const explanation = document.querySelector('.explanation')
const description = document.querySelector('.description')
const reasonForRecall = document.querySelector('.reasonForRecall')
const recallDate = document.querySelector('.recallDate')
const distributionPattern = document.querySelector('.distributionPattern')
const recallStatus = document.querySelector('.status')
const terminationDate = document.querySelector('.terminationDate')

const nameBrand = document.querySelector('.nameBrand')
const foodReactions = document.querySelector('.foodReactions')
const outcomes = document.querySelector('.outcomes')
const wrapper = document.querySelector('.wrapper')
const ewrapper = document.querySelector('.ewrapper')
const role = document.querySelector('.role')
const dateStarted = document.querySelector('.dateStarted')

const pageNumber1 = document.querySelector('.page-number1')
const pageNumber2 = document.querySelector('.page-number2')
const pageLimit = document.querySelectorAll('.limit')


let section;
let skip = 0;
let limit = 10;
let page;
let amount = 0
let total = 0
let enforcement;


const enforcementUrl = 'https://api.fda.gov/food/enforcement.json'
const eventUrl = 'https://api.fda.gov/food/event.json'

//can make a serverjs. on server.js i would do app.get('/enforcement') then call the regular link and in this one i would fetch('/enforcement')
let count = 0;
async function byReason(event){
    enforcement = true;
    if(count > 0)
    {
        removeElements()
        count = 0
    }

    if(event != undefined){
        skip = 0
    }

    document.querySelector('#enforcement').classList.remove('hidden');
    document.querySelector('#event').classList.add('hidden');
    document.querySelector('.heading').classList.add('hidden');
    let reason = document.querySelector('#reasonInput').value;
    let state = document.querySelector('#stateInput').value;
    let fromDate = document.querySelector('#fromDateInput').value;
    let toDate = document.querySelector('#toDateInput').value

    if(reason == "")
        reason = "Fruit"
    if(state === "")
        state = "nationwide";

    if(fromDate === "")
        fromDate = 20150101;
    if(toDate === "")
        toDate = Date.now();

    page = Math.floor((skip / limit) + 1)
    console.log(page)
    if(page < 26000 / limit)
        pageNumber1.innerHTML = page + 1
    if(page > 1)//could put hidden for prev page if doesn't satisfy
        pageNumber2.innerHTML = page - 1
    else if(page == 1)
        pageNumber2.innerHTML = ""
    pageLimit.innerHTML = limit
        
    // const reasonUrl = `${enforcementUrl}?search=reason_for_recall:"${reason}"+AND+distribution_pattern:"${state}"+AND+report_date:[${fromDate}+TO+${toDate}]&limit=10` 

    try{
        // const response = await fetch(reasonUrl)
        const response = await fetch(`/enforcement/${reason}/${state}/${fromDate}to${toDate}/${skip},${limit}`);
        const data = await response.json();
        console.log(data);

        if(Object.keys(data).length == 1){
            console.log("Nothing to print out")
            pageNumber1.innerHTML = ""
            pageNumber2.innerHTML = ""
        }
        else{
            count++;
            amount = data.results.length
            total = data.meta.results.total
            for(let i = 0; i < data.results.length; i++)
            {
                section = document.createElement('section')
                ewrapper.append(section)
                enforceAddOn(data.results[i], country, section)
                enforceAddOn(data.results[i], recallDate, section)
                enforceAddOn(data.results[i], recallStatus, section)
                enforceAddOn(data.results[i], terminationDate, section)
                enforceAddOn(data.results[i], classification, section)
                enforceAddOn(data.results[i], description, section)
                enforceAddOn(data.results[i], reasonForRecall, section)
                enforceAddOn(data.results[i], distributionPattern, section)
                // if(data.results[i].status === "Terminated")
                // {
                //     terminationDate.innerHTML = convertToDate(String(data.results[i].termination_date));
                //     terminationDate.classList.remove('hidden');
                // }
                // else{
                //     terminationDate.classList.add('hidden');
                // }
            }
        }
    }catch(error)
    {
        console.log(error);
    }
}

//sketch.js is main.js so index.js is server.js
//works now
//need to figure out how to get the skip back to zero when you make a new request but keep it where it's at when you click on
//next and prev page
async function byEffect(event){
    enforcement = false;
    if(count > 0)
    {
        removeElements()
        count = 0
    }

    if(event != undefined){
        skip = 0
    }
    // console.log(event)
    
    document.querySelector('#event').classList.remove('hidden');
    document.querySelector('#enforcement').classList.add('hidden');
    let industryName = document.querySelector('#industryNameInput').value
    let reactionsInput = document.querySelector('#reactionsInput').value
    let startDate = document.querySelector('#startDateInput').value
    let endDate = Date.now()
    
    page = Math.floor((skip / limit) + 1)
    console.log(page)
    if(page < 26000 / limit)
        pageNumber1.innerHTML = page + 1
    if(page > 1)//could put hidden for prev page if doesn't satisfy
        pageNumber2.innerHTML = page - 1
    else if(page == 1)
        pageNumber2.innerHTML = ""
    pageLimit.innerHTML = limit

    if(industryName == "")
        industryName = "Fruit"
    if(reactionsInput == "")
        reactionsInput = "DIARRHOEA"
    if(startDate == "")
        startDate = "20200101"

    // //Next is creating routes then after that learn to paginate the results
    // const foodUrl = `${eventUrl}?search=products.industry_name:"${industryName}"+AND+reactions:"${reactionsInput}"+AND+date_started:[${startDate}+TO+${endDate}]&limit=10`
    try{
        const response = await fetch(`/event/${industryName}/${reactionsInput}/${startDate}to${endDate}/${skip},${limit}`);
        const data = await response.json();
        console.log(data);

        if(Object.keys(data).length == 1){
            console.log("Nothing to print out")
            pageNumber1.innerHTML = ""
            pageNumber2.innerHTML = ""
        }
        else{
            count++;
            amount = data.results.length
            total = data.meta.results.total
            for(let i = 0; i < data.results.length; i++)
            {
                section = document.createElement('section')
                wrapper.append(section)
                let dResults = data.results[i];
                addOn(dResults.products, nameBrand, section);
                addOn(dResults.reactions, foodReactions, section);
                addOn(dResults.outcomes, outcomes, section);
                addOn(dResults, dateStarted, section)
            }
        }   
    }catch(error)
    {
        console.log(error);
    }
}

function convertToDate(oldDate)
{
    const dateArray = [];
    let year = oldDate.slice(0,4);
    let month = oldDate.slice(4,6);
    let date = oldDate.slice(6);
    dateArray[0] = month + "/";
    dateArray[1] = date + "/";
    dateArray[2] = year;
    return dateArray.join('');
}

function classificationExplain(classNum)
{
    if(classNum === 1)
        return "- Dangerous or defective products that predictably could cause serious health problems or death.";
    else if(classNum === 2)
        return "- Products that might cause a temporary health problem, or pose only a slight threat of a serious nature.";
    else
        return "- Products that are unlikely to cause any adverse health reaction, but that violate FDA labeling or manufacturing laws.";
}

//can add the ...(text-truncate or use css ellipsis) to the product descriptions using bootstrap if we want
function enforceAddOn(array, varName, sectionName)
{
    sectionName.classList.add("row")
    sectionName.classList.add("row-cols-1", "row-cols-md-2")
    let span = document.createElement("span");
    let h2 = document.createElement('h2');

    span = document.createElement("span");
    h2 = document.createElement('h2');
    h2.classList.add('takeout', "col-xl-2", "col-lg-3", "card");
    span.classList.add("card-text")

    switch(varName.classList.value){
        case "country":
            h2.innerHTML = array.country;
            break;
        case "classification":
            h2.innerHTML = "Classification: ";
            span.innerText =  array.classification;
            let espan = document.createElement('span')
            if(array.classification === "Class I")
                espan.innerText = classificationExplain(1);
            else if(array.classification === "Class II")
                espan.innerText = classificationExplain(2);
            else if(array.classification === "Class III")
                espan.innerText = classificationExplain(3);
            span.appendChild(espan)
            break;
        case "description":
            h2.innerHTML = "Product Description: ";
            span.innerText = array.product_description;
            break;
        case "reasonForRecall":
            h2.innerHTML = "Reason: ";
            span.innerText = array.reason_for_recall;
            break;
        case "distributionPattern":
            h2.innerHTML = "States Affected: ";
            span.innerText =  array.distribution_pattern;
            break;
        case "recallDate":
            h2.innerHTML = "Recall date: ";
            span.innerText =  convertToDate(String(array.recall_initiation_date));
            break;
        case "status":
            h2.innerHTML = "Status: ";
            span.innerText =  array.status;
            break;
        case "terminationDate":
            h2.innerHTML = "Termination Date: ";
            if(array.status === "Terminated")
            {
                span.innerText = convertToDate(String(array.termination_date));
                terminationDate.classList.remove('hidden');
            }
            else{
                // h2.classList.remove('takeout', "col-xl-2", "col-lg-3", "card");
                terminationDate.classList.add('hidden');
            }
            break;
    }

    sectionName.appendChild(h2);
    h2.appendChild(span);

}

function addOn(array, varName, sectionName)
{
    sectionName.classList.add("row")
    sectionName.classList.add("row-cols-1", "row-cols-md-2")
    let span = document.createElement("span");
    let h2 = document.createElement('h2');
    let rolespan;
    let roleh2;
    

    if(varName.classList.value == "dateStarted")
    {
        h2.innerHTML = "Date Started: ";
        h2.classList.add('takeout', "col-xl-2", "col-lg-3", "card");
        span.classList.add("card-text")
        if(array.date_started == undefined){
            span.innerText = "No date recorded"
        }
        else{
            span.innerText = convertToDate(array.date_started);
        }
        sectionName.appendChild(h2);
        h2.appendChild(span);
    }else{
        let lastVal;
        for(let i = 0; i < array.length; i++)
        {
            //can simplify/optimize code
            if(lastVal === "foodReactions" && varName.classList.value === "foodReactions" )
            {
                span.append(formalSpeak(", " + array[i]));
            }
            else if(lastVal === "outcomes" && varName.classList.value === "outcomes")
            {
                span.append(formalSpeak(", " + array[i]));
            }
            else
            {
                span = document.createElement("span");
                h2 = document.createElement('h2');
                h2.classList.add('takeout', "col-xl-2", "col-lg-3", "card");
                span.classList.add("card-text")
                if(varName.classList.value === "foodReactions"){
                    h2.classList.replace("col-xl-2", "col-xl-3")
                    h2.innerHTML = "Food Reactions: ";
                    span.innerText =  formalSpeak(array[i]);
                }else if(varName.classList.value === "nameBrand")
                {
                    rolespan = document.createElement('span')
                    roleh2 = document.createElement('h2');
                    roleh2.classList.add('takeout', 'col-xl-2', "col-lg-3", "card");
                    h2.classList.replace("col-xl-2", "col-xl-3")
                    rolespan.classList.add("text-wrap")
                    h2.innerHTML = "Brand Name: ";
                    span.innerText = formalSpeak(array[i].name_brand);
                    roleh2.innerHTML = "Role: ";
                    rolespan.innerText = formalSpeak(array[i].role);
                }
                else if(varName.classList.value === "outcomes")
                {
                    h2.innerHTML = "Outcomes: ";
                    span.innerText = array[i];
                }
    
                sectionName.appendChild(h2);
                h2.appendChild(span);
                if(varName.classList.value === "nameBrand")
                {
                    sectionName.appendChild(roleh2)
                    roleh2.appendChild(rolespan)
                }
                lastVal = varName.classList.value;          
            }
                    
        }    
    }    
}

function formalSpeak(str) {
    const formalStr = [];
    formalStr[0] = str[0].toUpperCase();
    for(let i = 1; i < str.length; i++)
    {
        if(str[i - 1] == " ")
            formalStr[i] = str[i].toUpperCase();
        else
            formalStr[i] = str[i].toLowerCase();
    }
    return formalStr.join('');
};

function removeElements(){
    const theseClasses = document.querySelectorAll('.takeout')
    
    const end = theseClasses[0].parentNode.parentNode.children.length
    let diff;
    if(theseClasses[0].parentNode.parentNode.classList == "wrapper")
        diff = 5
    else
        diff = 9
    for(let i = 0; i < end - diff; i++)
    {
        theseClasses[0].parentNode.parentNode.removeChild(theseClasses[0].parentNode.parentNode.lastElementChild)
    }
}

//figured it out when skip is 10 and total is 20. we are showing the last 10 elements so skip + limit should be strictly less than
//total so you can safely go to the next page
function changePage(event){
    if(amount == limit && (skip + limit) < total && event.target.id == "next-page")
    {
        skip += limit
        if(enforcement == true)
            byReason()
        else
            byEffect()
    }
    else if(page > 1 && event.target.id == "prev-page")
    {
        skip -= limit
        if(enforcement == true)
            byReason()
        else
            byEffect()
    }
}
