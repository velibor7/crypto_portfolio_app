const https = require('https');
const axios = require('axios');

const getDataFromCMP = async () => {
    // make external api call and save to data.json
    // https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {

    //let url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'


    let response = null;

    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
                headers: {
                    'X-CMC_PRO_API_KEY': '1c180187-7a10-42e7-b0c6-a946473c3e8d',
                },
                params: {
                    'start':'1',
                    'limit':'199',
                    'convert':'USD'
                }
            });
        } catch(ex) {
            response = null;
            // error
            console.log(ex);
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            console.log(json);
            resolve(json);
        }
    });

}


const calculatePortfolioValue = (uid) => {
    // open the file
    let totalValue
    let investmentList // get all investments of a user uid

    // for each investment in investment list
    // if short_name_handle == symbol...
    // update that investment
    // calculate totalvalue and append it to portfoliovalue entity

}

const calculateAllPortfolioValues = () => {
    // getDataFromCMP()
    let usersList // users.getall

    usersList.forEach(user => {
        calculatePortfolioValue(user.id)
    })
}


getDataFromCMP()