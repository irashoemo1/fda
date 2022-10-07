const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const { request, response } = require('express');
const PORT = process.env.PORT || 2121;


app.use(cors())

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', async (request, response) => {
    try{
        response.render('index.ejs')
    }catch(error)
    {
        console.log(error)
    }
    
})

app.get('/event/:industryName/:reactions/:timeFrame/:paginate', async (request, response) => {
    console.log(request.params);
    let industryName = request.params.industryName;
    let reactions = request.params.reactions;
    let timeFrame = request.params.timeFrame.split('to');
    let startDate = timeFrame[0];
    let endDate = timeFrame[1];
    let paginate = request.params.paginate.split(',');
    let skip = paginate[0]
    let limit = paginate[1]
    //let page = (skip / limit) + 1 idk page will be something with skip and limit
    const foodUrl = `https://api.fda.gov/food/event.json?search=products.industry_name:"${industryName}"+AND+reactions:"${reactions}"+AND+date_started:[${startDate}+TO+${endDate}]&skip=${skip}&limit=${limit}`
    const fetch_response = await fetch(foodUrl);
    const json = await fetch_response.json();
    response.json(json)
    // console.log(data);
})


app.get('/enforcement/:reason/:state/:timeFrame/:paginate', async (request, response) => {
    console.log(request.params);
    let reason = request.params.reason;
    let state = request.params.state
    let timeFrame = request.params.timeFrame.split('to');
    let fromDate = timeFrame[0];
    let toDate = timeFrame[1];
    let paginate = request.params.paginate.split(',');
    let skip = paginate[0]
    let limit = paginate[1]
    // const reasonUrl = `${enforcementUrl}?search=reason_for_recall:"${reason}"+AND+distribution_pattern:"${state}"+AND+report_date:[${fromDate}+TO+${toDate}]&limit=10` 
    const reasonUrl = `https://api.fda.gov/food/enforcement.json?search=reason_for_recall:"${reason}"+AND+distribution_pattern:"${state}"+AND+report_date:[${fromDate}+TO+${toDate}]&skip=${skip}&limit=${limit}`
    const fetch_response = await fetch(reasonUrl)
    const json = await fetch_response.json()
    response.json(json)
    // console.log(data);
})


app.listen(PORT, () => {
    console.log(`Starting server at ${PORT}`);
  });