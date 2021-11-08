const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
var path = require('path');
var fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/', async (req, res) => {
    const url = req.body.url;
    var fileName = `${uuidv4()}.pdf`;
    var options = {
        root: path.join(__dirname)
    };

    try {
        console.log(`ws://${process.env.CHROME_URL}`);
        // const browser = await puppeteer.connect({ browserWSEndpoint: `ws://${process.env.CHROME_URL}` });
        // const browser = await puppeteer.connect({ browserWSEndpoint: `wss://localhost:3001` });
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto(url, {
        waitUntil: 'networkidle2',
        });
        
        await page.pdf({ 
            path: fileName, 
            format: 'a4', 
            margin: {
                top: "0.4in",
                right: "0.4in",
                bottom: "0.4in",
                left: "0.4in"
            }
        });
    
        await browser.close();
        res.sendFile(fileName, options, function (err) {
            if (err) {
                fs.unlinkSync(fileName);
                res.sendStatus(500);
            } else {
                fs.unlinkSync(fileName);
                console.log(`${fileName} was deleted.`);
            }
        });
    } catch (e) {
        console.log(e);
        res.send(e);
    }
})

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
})