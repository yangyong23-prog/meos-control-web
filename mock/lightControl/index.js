import pageControllerDetails from './pageControllerDetails.json';
import pageCircuitDetails from './pageCircuitDetails.json';
const options = [
    {
        url: '/api/lighting/pageControllerDetails',
        method: 'post',
        response: () => pageControllerDetails,
        timeout: 1000
    },
    {
        url: '/api/lighting/pageCircuitDetails',
        method: 'post',
        response: () => pageCircuitDetails,
        timeout: 1000
    }
    // {
    // 	url: /\/v1\/ledger\/instructed-bank-account-transactions\/preview-payouts.*/,
    // 	method: 'get',
    // 	response: () => [
    // 		{
    // 			payout_date: '2023-08-22T00:00:00Z',
    // 			estimated_amount: -136800,
    // 			charges: 0,
    // 			refunds: 3
    // 		}
    // 	],
    // 	timeout: 1000
    // }
];

export default options;
