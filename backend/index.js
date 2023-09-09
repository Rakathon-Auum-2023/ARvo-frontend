import puppeteer from 'puppeteer';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { open } from 'node:fs/promises'
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import request from 'request';

function userDataDirectory() {
    const dir = {
        'linux': '~/.config/google-chrome',
        'darwin': `/Users/${os.userInfo().username}/Library/Application Support/Google/Chrome`,
    };

    if (dir[process.platform] != undefined) {
        return dir[process.platform];
    }

    throw 'OS not supported';
}

function chromeExecutablePath() {
    const dir = {
        'linux': '/usr/bin/google-chrome',
        'darwin': `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
    };

    if (dir[process.platform] != undefined) {
        return dir[process.platform];
    }

    throw 'OS not supported';
}

async function download(url) {
    const name = uuidv4();
    console.log(name);
    const path = `outputs/${name}.jpeg`;
    const f = await open(path, 'w');
    const resp = await fetch(url);
    await f.write(new Uint8Array(await resp.arrayBuffer()));
    await f.close();
    return path;
}

const data = {
    0: {'phone': '+917020582873', 'email': 'hemilruparel2002@gmail.com'},
    1: {'phone': '+917982828659', 'email': 'taps1197@gmail.com'},
    2: {'phone': '+918093644586', 'email': 'sidharth.auum@niisgroup.org'},
    3: {'phone': '+917381665122', 'email': 'prachisoumya0516@gmail.com'},
}

async function main () {
    const browser = await puppeteer.launch({
        // headless: 'new',
        headless: false,
        executablePath: chromeExecutablePath(),

        /// Puppeteer by default creates a new profile and diposes it at 
        /// when browser is closed but we want to use existing profiles 
        /// as we cant ask RMs to login into their whatsapp everyday
        userDataDir: userDataDirectory(),
        args: [
            '--profile-directory=Default'
        ]
    });

    const app = express();
    const port = 4000;

    app.use(express.static('outputs'));
    app.use(express.json());
    app.use(cors());
    app.use((_, resp, next) => {
        resp.set('ngrok-skip-browser-warning', '*');
        next();
    });



    app.post('/send', (req, resp) => {
        sendWhatsapp(data[req.body.id]['phone'], req.body.image_url, req.body.description);
        sendEmail(data[req.body.id]['email'], req.body.description.substring(0, 100), req.body.description);
        res.json({'success': true});
    });

    app.post('/generate', async (req, res) => {
        const page = await browser.newPage();

        /// Source: https://stackoverflow.com/questions/58089425/how-do-print-the-console-output-of-the-page-in-puppeter-as-it-would-appear-in-th/60075804#60075804
        /// print values the web page prints on console on console log
        /// Without this, console.log inside page.evaluate does not work
        page.on('console', async e => {
            const args = await Promise.all(e.args().map(a => a.jsonValue()));
            console.log(...args);
        });

        /// By default puppeteer sets user agent to headless version 
        /// because of which whatsapp does not load. So override it 
        /// to use the default user agent
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

        await page.goto('https://designer.microsoft.com/');

        // Set screen size
        await page.setViewport({ width: 1920, height: 1080 });

        const searchArea = await page.waitForSelector('.fui-Textarea__textarea');
        await searchArea.click();

        await searchArea.type(req.body.prompt, { delay: 100 });

        const search = await page.$('div.ms-Stack > button:nth-child(2) > span > span');
        await search.click();

        await page.waitForSelector('div[data-test-id=dfs-content-suggestion-grid]', { timeout: 60_000 });
        const images = await page.$$('div[data-test-id=dfs-content-suggestion-grid] img');

        const imageUrls = [];

        for (const image of images) {
            const data = await page.evaluate(getImage, image);
            const name = uuidv4();
            console.log(name);
            const f = await open(`outputs/${name}.jpeg`, 'w');
            const resp = await fetch(`data:application/octet-stream;base64,${data}`);

            await f.write(new Uint8Array(await resp.arrayBuffer()));
            await f.close();
            imageUrls.push(`http://localhost:4000/${name}.jpeg`);
        }

        res.json(imageUrls);
        await page.close();
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};

main();

async function getImage(image) {
    const base64_arraybuffer = async (data) => {
        // Use a FileReader to generate a base64 data URI
        const base64url = await new Promise((r) => {
            const reader = new FileReader()
            reader.onload = () => r(reader.result)
            reader.readAsDataURL(new Blob([data]))
        })

        /*
        The result looks like 
        "data:application/octet-stream;base64,<your base64 data>", 
        so we split off the beginning:
        */
        return base64url.substring(base64url.indexOf(',') + 1)
    }

    const resp = await fetch(image.src);
    const buffer = new Uint8Array(await resp.arrayBuffer());
    const ret = await base64_arraybuffer(buffer);
    console.log(ret);
    return ret;
}

function sendEmail(to, subject, body) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hemilruparel2002@gmail.com',
            pass: 'qqvnecowmyuosrvl', // Use an App Password or OAuth2 token for security
        },
    });

    // Email data
    const mailOptions = {
        from: 'hemilruparel2002@gmail.com',
        to: to,
        subject: subject,
        text: body,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

async function sendWhatsapp(phone, image, description) {
    var options = {
        method: 'POST',
        url: 'https://api.ultramsg.com/instance60847/messages/image',
        headers: {'content-type': ' application/x-www-form-urlencoded'},
        form: {
          "token": "8zkx6xxzraj8nbiz",
          "to": phone,
          "image": image,
          "caption": description,
      }
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        console.log(body);
      });
}