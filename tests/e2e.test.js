const playwright = require('playwright');

(async () => {
  for (const browserType of ['chromium']) {
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://localhost:3000/books/list');
    // 截图
    await page.screenshot({ path: `report/example.png` });
    await browser.close();
  }
})();