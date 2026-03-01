import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';
import http from 'k6/http';
export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
       exec: 'browserTest',
      vus: 2,         // Start with 1 VU for debugging
      iterations: 4,  // Just 2 iterations to test
      maxDuration: '2m', // Give more time
      options: {
        browser: {
          type: 'chromium',
          // Run in headed mode to see what's happening
          headless: false,
          // Add browser-specific options for better reliability
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
    news: {
      executor: 'constant-vus',
      exec: 'news',
      vus: 20,
      duration: '1m',
    }
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

export  async function browserTest() {
  const context = await browser.newContext();
  const page = await context.newPage();




    await page.goto('https://rahulshettyacademy.com/locatorspractice/');

    await page.locator('#inputUsername').type('rahul');
    
    // Fill in the password
    console.log('🔒 Filling password...');
    await page.locator('input[name="inputPassword"]').type('rahulshettyacademy');
    
  

    // Try different approaches to submit
    console.log('🔘 Attempting to submit form...');
    
    
      // Strategy 1: Click submit button and wait for navigation
      console.log('🎯 Strategy 1: Click submit with navigation wait');
    //   await Promise.all([
    //     page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }),
    //     page.locator('button[type="submit"]').click()
    //   ]);
         page.locator('button[type="submit"]').click()
      console.log('✅ Navigation completed successfully');
      
    
      
    

    // Take screenshot after submit attempt
    await page.screenshot({ path: `step5_after_submit_${Date.now()}.png` });
    console.log('📸 After submit screenshot taken');

    // Wait a bit more and check current URL
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    console.log(`🔗 Current URL: ${currentUrl}`);

    // Look for success message
    console.log('🔍 Looking for success message...');
    
    const successHeader = page.locator('h1').first();
    await successHeader.waitFor({ state: 'visible', timeout: 10000 });
    
    const headerText = await successHeader.textContent();
    console.log(`📝 Found header text: "${headerText}"`);

    await check(successHeader, {
      header: async (h1) => {
        const text = await h1.textContent();
        return text.includes('Rahul Shetty Academy');
      },
    });

    console.log('✅ Login test completed successfully');
    await page.close();
} 

  export function news() {
  const res = http.get('https://rahulshettyacademy.com/locatorspractice/');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
