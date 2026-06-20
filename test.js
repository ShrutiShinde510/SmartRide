const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log("Navigating...");
  await page.goto('http://localhost:5173/driver-dashboard/ride/6a35f2a1430c54f2766a8172/navigate', { waitUntil: 'networkidle' });
  
  console.log("Waiting 2s...");
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
