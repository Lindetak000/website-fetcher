const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/render', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url query param');

  try {
    const browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const content = await page.content();
    await browser.close();

    res.send(content);
  } catch (error) {
    res.status(500).send('Error rendering page: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

