import { Builder, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const CHROME_OPTIONS = [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-web-security",
    "--allow-running-insecure-content",
    "--disable-extensions",
    "--disable-plugins",
    "--disable-popup-blocking",
    "--disable-features=IsolateOrigins,site-per-process",
    "--disable-site-isolation-trials",
    "--ignore-certificate-errors",
    "--ignore-ssl-errors",
    "--ignore-certificate-errors-spki-list",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-size=1920,1080",
    "--disable-notifications",
    "--disable-background-networking",
    "--disable-breakpad",
    "--disable-component-extensions-with-background-pages",
    "--disable-default-apps",
    "--silent",
    "--disable-logging",
    "--disable-sync"
];

class SeleniumChromeAgent {
    constructor(proxy_ent) {
        const options = new chrome.Options();
        // Specify user agent string for a recent version of Chrome
        const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36";

        options.addArguments(`--user-agent=${userAgent}`);
        CHROME_OPTIONS.forEach(option => options.addArguments(option));

        const proxyHost = proxy_ent ? proxy_ent.ip : null;
        const proxyPort = proxy_ent ? proxy_ent.port : null;
        const proxyUsername = proxy_ent ? proxy_ent.username : null;
        const proxyPassword = proxy_ent ? proxy_ent.password : null;

        console.log(`Proxy: ${proxyHost}:${proxyPort}`);

        if (proxyHost && proxyPort) {
            console.log(`Using proxy ${proxyHost}:${proxyPort}`);
            options.addArguments(`--proxy-server=http://${proxyHost}:${proxyPort}`);
        }

        if (proxyUsername && proxyPassword) {
            options.addArguments(`--proxy-auth=${proxyUsername}:${proxyPassword}`);
        }

        // Initialize the Chrome driver with these options
        this.driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    }

    async getDriver() {
        return this.driver;
    }

    async close() {
        await this.driver.quit();
    }

    async checkForCookieConsent() {
        // <button id="onetrust-reject-all-handler">Tout refuser</button>
        try {
            const rejectButton = await this.driver.findElement(By.id('onetrust-reject-all-handler'));
            if (rejectButton) {
                await rejectButton.click();
            }
        }
        catch (err) {
            console.log('No cookie consent found');
        }

    }
}

export { SeleniumChromeAgent };