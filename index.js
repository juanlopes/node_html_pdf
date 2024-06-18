const express = require('express')
const puppeteer = require('puppeteer');
const app = express();

app.use(express.json())


const convertToPDF = async (content) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: `new` });
    const page = await browser.newPage();

    await page.setContent(content);

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return pdfBuffer;
}

app.post('/', async (req, res) => {
    const { content } = req.body;

    try {
        const pdf = await convertToPDF(content);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=file_${+new Date}.pdf`);

        res.send(pdf);
    } catch (error) {
        console.log(error)
        res.send({'error': error})
    }
})

app.listen(3000, () => {
    console.log('running on localhost:3000')
})