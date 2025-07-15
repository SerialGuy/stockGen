import type { NextApiRequest, NextApiResponse } from 'next';
const axios = require('axios');
const cheerio = require('cheerio');

async function getStockQuote(stockNumber: string) {
    const URI = 'https://klse.i3investor.com/servlets/stk/' + stockNumber + '.jsp';
    const response = await axios.get(URI, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
    });

    const $ = cheerio.load(response.data);
    const stockPrice  = $('table#stockhdr > tbody > tr:last-child > td:first-child').text().trim();
    const stockName   = $('#content > table:nth-child(2) > tbody > tr > td:nth-child(1) > div.margint10 > table:nth-child(2) > tbody > tr > td:nth-child(1) > span').text().trim();
    const companyName = $("#content > table:nth-child(2) > tbody > tr > td:nth-child(1) > div.margint10 > table:nth-child(2) > tbody > tr > td:nth-child(3) > span").text().trim();
    const dailyChange = $("#stockhdr > tbody > tr:nth-child(2) > td:nth-child(2) > span").text().trim().split(" ");

    const dateRetrieved = new Date();

    const output = {
        dateRetrieved: dateRetrieved.toISOString(),
        companyName: companyName,
        name: stockName.split(':')[1]?.trim().split(' ')[0] || null,
        ticker: stockName.split(':')[1]?.trim().split(' ')[1]?.slice(1, -1) || null,
        stockPrice: stockPrice,
        change: {
            amount: dailyChange[0] || null,
            percentage: dailyChange[0]?.charAt(0) + (dailyChange[1]?.slice(1, -1) || '')
        }
    };

    return output;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { symbol, id } = req.query;
    const stockNumber = (symbol || id) as string;
    if (!stockNumber) return res.status(400).json({ error: 'Missing symbol or id' });
    try {
        const quote = await getStockQuote(stockNumber);
        res.status(200).json(quote);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to fetch or parse data' });
    }
} 