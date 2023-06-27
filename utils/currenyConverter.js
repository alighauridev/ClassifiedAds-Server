import axios from 'axios';

const convertCurrency = async (amount, baseCurrency, targetCurrency) => {
    const apiKey = '123b19bed6f4438f9cd292724f4ce445'; // Replace with your API key
    const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        const exchangeRates = response.data.rates;

        // Convert the amount from the base currency to the target currency
        const convertedAmount = (amount / exchangeRates[baseCurrency]) * exchangeRates[targetCurrency];

        return convertedAmount;
    } catch (error) {
        throw new Error('Currency conversion failed');
    }
};

export { convertCurrency };
