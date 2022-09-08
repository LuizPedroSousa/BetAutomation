import { Browser, Frame, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { injectable } from 'tsyringe';
import { ClickDTO } from '../dtos/ClickDTO';
import { FillInputDTO } from '../dtos/FillInputDTO';
import { GetAttributeDTO } from '../dtos/GetAttributeDTO';
import { GetElementDTO } from '../dtos/GetElementDTO';
import { GetTextDTO } from '../dtos/GetTextDTO';
import { GoToDTO } from '../dtos/GoToDTO';
import { OpenPageDTO } from '../dtos/OpenPageDTO';
import { fillAttributes } from '../helpers/fillAttributes';
import { HeadlessProvider } from '../ports/HeadlessProvider';

@injectable()
export class PuppeteerHeadlessProvider implements HeadlessProvider {
  private pageInstance: Page | null = null;
  private popUpInstance: Page | null = null;
  private page: Page | null = null;
  public browser: Browser | null = null;

  private popUpInstances: Page[] = [];

  private async getOptions(headless: boolean): Promise<Partial<any>> {
    return {
      args: ['--load-extensions', '--start-maximized'],
      headless,
      ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
    };
  }

  private async reset() {
    if (this.browser) await this.browser.close();
    if (this.page) await this.page.close();

    this.browser = null;
    this.page = null;
    this.pageInstance = null;
    this.popUpInstance = null;
    this.cleanPopUps();
  }

  public async open({ dimensions, headless }: OpenPageDTO = { headless: false }): Promise<void> {
    await this.reset();

    const options = await this.getOptions(headless || false);

    puppeteer.use(StealthPlugin());

    this.browser = await puppeteer.launch(options);
    const browserWSEndpoint = this.browser.wsEndpoint();
    puppeteer.connect({ browserWSEndpoint: browserWSEndpoint });

    this.pageInstance = await this.browser.newPage();

    this.page = this.pageInstance;

    await this.page.setViewport(
      dimensions || {
        width: 1366,
        height: 768,
      },
    );

    await this.page.setExtraHTTPHeaders({
      'accept-language': 'en-US,en;q=0.9,hy;q=0.8',
    });

    await this.page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
    );
  }

  public async reload(): Promise<void> {
    await this.page.reload();
  }

  public getPage(): Page {
    if (!this.page) {
      process.exit(0);
    }
    return this.page;
  }

  public async scroll(): Promise<void> {
    const page = this.getPage();

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
  }

  public async fillInput({
    target,
    element,
    element_attributes,
    element_text_content,
    max_selector_timeout,
    text,
    timeout,
    attributes,
    is_iframe,
  }: FillInputDTO): Promise<boolean> {
    try {
      let page: Page | Frame = this.getPage();

      const selector = `${target || 'input'}${fillAttributes(attributes)}${fillAttributes({
        element,
        ...element_attributes,
      })}`;

      if (timeout) await page.waitForTimeout(timeout);

      if (is_iframe) {
        await page.waitForSelector(
          'iframe[id="contentFrame"]',

          max_selector_timeout
            ? {
                timeout: max_selector_timeout,
              }
            : {},
        );

        const iframeHandle = await page.$('iframe[id="contentFrame"]');

        const iframe = await iframeHandle.contentFrame();

        await iframe.waitForSelector(
          'iframe',

          max_selector_timeout
            ? {
                timeout: max_selector_timeout,
              }
            : {},
        );

        const nestedIframeHandle = await iframe.$('iframe');

        page = await nestedIframeHandle.contentFrame();
      }

      await page.waitForSelector(
        selector,
        max_selector_timeout
          ? {
              timeout: max_selector_timeout,
            }
          : {},
      );

      if (element_text_content) {
        const textContent = await page.$eval(selector, element => element.textContent);

        if (textContent.toLowerCase() !== element_text_content.toLowerCase()) {
          return false;
        }
      }
      await page.click(selector, { clickCount: 3 });
      await page.type(selector, text);

      return true;
    } catch (error: any) {
      return false;
    }
  }

  public async cleanPopUps(): Promise<void> {
    await Promise.all(this.popUpInstances.map(instance => instance.close));
    this.popUpInstances = [];
  }

  public async waitForPopUp(timeout?: number): Promise<void> {
    const page = await new Promise<Page>(resolve => {
      if (timeout) setTimeout(resolve, timeout);
      this.browser.once('targetcreated', target => resolve(target.page()));
    });

    if (page) {
      this.popUpInstance = page;
      this.popUpInstances.push(page);
    }
  }

  public async goTo({ url, navigation_timeout, timeout }: GoToDTO): Promise<void> {
    const page = this.getPage();

    if (timeout) await page.waitForTimeout(timeout);

    await this.getPage().goto(url, {
      timeout: navigation_timeout,
      waitUntil: 'domcontentloaded',
    });
  }

  public async click({
    text,
    attributes,
    timeout,
    target,
    element,
    element_attributes,
    max_selector_timeout,
    is_iframe,
  }: ClickDTO): Promise<boolean> {
    let page: Page | Frame = this.getPage();

    if (timeout) await page.waitForTimeout(timeout);

    if (is_iframe) {
      await page.waitForSelector(
        'iframe[id="contentFrame"]',

        max_selector_timeout
          ? {
              timeout: max_selector_timeout,
            }
          : {},
      );

      const iframeHandle = await page.$('iframe[id="contentFrame"]');

      const iframe = await iframeHandle.contentFrame();

      await iframe.waitForSelector(
        'iframe',

        max_selector_timeout
          ? {
              timeout: max_selector_timeout,
            }
          : {},
      );

      const nestedIframeHandle = await iframe.$('iframe');

      page = await nestedIframeHandle.contentFrame();
    }

    const selector = `${target || 'button'}${fillAttributes(attributes)}${fillAttributes({
      element,
      ...element_attributes,
    })}`;

    try {
      await page.waitForSelector(
        selector,
        max_selector_timeout
          ? {
              timeout: max_selector_timeout,
            }
          : {},
      );

      if (text) {
        const textContent = await page.$eval(
          `${selector}${fillAttributes({ element: text?.element, children: text?.children })}`,
          element => element.textContent,
        );

        if (textContent.toLowerCase() !== text.value.toLowerCase()) {
          return false;
        }
      }

      const button = await page.$(selector);

      if (!button) {
        return false;
      }

      await button.click();

      return true;
    } catch (error: any) {
      console.log('click failed', selector);
      return false;
    }
  }

  public async getElement({
    target,
    text,
    attributes,
    timeout,
    element_attributes,
    element,
    max_selector_timeout,
  }: GetElementDTO) {
    const page = this.getPage();

    if (timeout) await page.waitForTimeout(timeout);

    const selector = `${target || 'div'}${fillAttributes(attributes)}${fillAttributes({
      element,
      ...element_attributes,
    })}`;

    try {
      await page.waitForSelector(
        selector,
        max_selector_timeout
          ? {
              timeout: max_selector_timeout,
            }
          : {},
      );

      if (text) {
        const textContent = await page.$eval(
          `${selector}${fillAttributes({ element: text?.element, children: text?.children })}`,
          element => element.textContent,
        );

        if (textContent.toLowerCase() !== text.value.toLowerCase()) {
          return false;
        }
      }

      const element = await page.$(selector);

      if (!element) {
        return false;
      }

      return true;
    } catch (error: any) {
      console.log('getElement failed', selector);
      return false;
    }
  }

  public async getText({
    target,
    attributes,
    timeout,
    is_iframe,
    element_attributes,
    element,
    max_selector_timeout,
  }: GetTextDTO): Promise<string> {
    const selector = `${target || 'div'}${fillAttributes(attributes)}${fillAttributes({
      element,
      ...element_attributes,
    })}`;
    try {
      let page: Page | Frame = this.getPage();

      if (timeout) await page.waitForTimeout(timeout);

      if (is_iframe) {
        await page.waitForSelector(
          'iframe[id="contentFrame"]',

          max_selector_timeout
            ? {
                timeout: max_selector_timeout,
              }
            : {},
        );

        const iframeHandle = await page.$('iframe[id="contentFrame"]');

        const iframe = await iframeHandle.contentFrame();

        await iframe.waitForSelector(
          'iframe',

          max_selector_timeout
            ? {
                timeout: max_selector_timeout,
              }
            : {},
        );

        const nestedIframeHandle = await iframe.$('iframe');

        page = await nestedIframeHandle.contentFrame();
      }

      await page.waitForSelector(
        selector,
        max_selector_timeout
          ? {
              timeout: max_selector_timeout,
            }
          : {},
      );

      const textContent = await page.$eval(selector, element => {
        return element.textContent;
      });

      return textContent || '';
    } catch (error: any) {
      return '';
    }
  }

  public async togglePage(isPage: boolean): Promise<void> {
    try {
      if (!isPage) {
        this.page = this.popUpInstance;

        await this.pageInstance.setViewport({
          width: 1366,
          height: 768,
          deviceScaleFactor: 0,
        });

        await this.page.setViewport({
          width: 1366,
          height: 768,

          deviceScaleFactor: 1,
        });

        return;
      }

      this.page = this.pageInstance;

      await this.popUpInstance.setViewport({
        height: 0,
        width: 0,
        deviceScaleFactor: 0,
      });

      await this.page.setViewport({
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
      });
    } catch (error: any) {
      console.log('togglePage failed');
    }
  }

  public async getAttribute({ target, attribute_name, is_iframe, max_selector_timeout }: GetAttributeDTO) {
    let page: Page | Frame = this.getPage();

    if (is_iframe) {
      await page.waitForSelector(
        'iframe[id="contentFrame"]',

        max_selector_timeout
          ? {
              timeout: max_selector_timeout,
            }
          : {},
      );

      const iframeHandle = await page.$('iframe[id="contentFrame"]');

      const iframe = await iframeHandle.contentFrame();

      await iframe.waitForSelector(
        'iframe',

        max_selector_timeout
          ? {
              timeout: max_selector_timeout,
            }
          : {},
      );

      const nestedIframeHandle = await iframe.$('iframe');

      page = await nestedIframeHandle.contentFrame();
    }

    const attribute = await page.$eval(target, (element, name) => element.getAttribute(name), attribute_name);

    return attribute;
  }

  public async getCookie(key: string): Promise<any> {
    await this.page?.waitForTimeout(2000);

    const client = await this.page?.target().createCDPSession();
    const cookies = (await client.send('Network.getAllCookies')).cookies;

    const cookie = cookies.find(cookie => cookie.name === key);

    return cookie;
  }

  public async getCookies(): Promise<any[]> {
    await this.page?.waitForTimeout(2000);
    const client = await this.page?.target().createCDPSession();
    const cookies = (await client.send('Network.getAllCookies')).cookies;

    return cookies;
  }

  public async setCookies(data: any[]): Promise<void> {
    await this.page?.waitForTimeout(2000);

    await this.page?.setCookie(...data);
  }
}
