import  check  from 'k6';
import browser  from 'k6/browser'
// no HTTP imports in a browser-only script; mixing modules causes runtime errors
// import {http, sleep } from 'k6/http';

export const options = {
    //4 or 5  - put load on url get call  - 100 users, [url browser - 1 user]
    scenarios: {
        ui: {
            executor: "shared-iterations",
            exec: 'browserTest',
            vus: 2,
            maxDuration: '1m',
            iterations: 4,
            options: {
                browser: {
                    type: 'chromium',
                    headless: false
                }
            }
        },
        // backEndStress scenario removed; keep browser-only script to avoid
        // conflicts between the browser extension and other k6 modules.
        // To run a backend-only stress test, put a second script without
        // imports from 'k6/browser'.
        /*
        backEndStress: {
            executor: "constant-vus",
            exec: 'backEndStress',
            vus: 20,
            duration: '1m'
        }
        */
    },
    thresholds: {
        checks: ['rate==1.0']
    }
}


export async function browserTest() {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/locatorspractice/");
    await page.locator("#inputUsername").type("rahul");
    await page.locator("input[placeholder='Password']").type("rahulshettyacademy");
    await page.locator("button[type='submit']").click();
    console.log("Navigated to the page:");
    await page.waitForTimeout(2000);

    const headerText = await page.locator("h1").first().textContent()
    check(headerText, {
        header: (text) => {
            return text.includes('Rahul Shetty Academy')
        }
    });
    page.close();
}

// export async function backEndStress() {
//     const res = http.get("https://rahulshettyacademy.com/locatorspractice/");
//     sleep(1);
//     check(res, {
//         'status is 200': (r) => r.status === 200
//     });
// }
// (If you need backend stress tests, put them in a separate file that only
// imports from 'k6/http' and 'k6').