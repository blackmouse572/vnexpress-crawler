import { createPuppeteerRouter, Dataset } from 'crawlee';
import { NodeHtmlMarkdown } from 'node-html-markdown';

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ enqueueLinks, page, log }) => {
    log.info(`Enqueueing new URLs: ${page.url()}`);
    await page.waitForSelector('#isArticleTax');

    await enqueueLinks({
        selector: '#list-news > article > h3 > a',
        label: 'detail',
    });

    const nextButton = await page.$('a.btn-page.next-page');
    if (nextButton) {
        await enqueueLinks({
            selector: 'a.btn-page.next-page',
        });
    }
});

router.addHandler('detail', async ({ request, page, log }) => {
    const title = await page.title();
    log.info(`Get details: ${title}`, { url: request.loadedUrl });
    const labelNode = await page.$('h1.title-detail');
    const descriptionNode = await page.$('p.description');
    const detailNode = await page.$('article.fck_detail');

    const label = await labelNode?.evaluate((e) => e.innerText);
    const description = await descriptionNode?.evaluate((e) => e.innerText);
    const detail = await detailNode
        ?.evaluate((e) => e.innerHTML)
        .then((html) => {
            return NodeHtmlMarkdown.translate(html);
        });
    await Dataset.pushData({
        title,
        label,
        description: [description, detail].join('\n'),
        url: request.loadedUrl,
    });
    // const dataset = new NewsDocument({
    //     title,
    //     label,
    //     description: [description, detail].join('\n'),
    //     url: request.loadedUrl,
    // });

    // await dataset
    //     .save({})
    //     .then((e) => {
    //         if (!e.errors) {
    //             log.info(`Saved: ${title}`, { url: request.loadedUrl });
    //         }
    //     })
    //     .catch((err) => {
    //         // if the URL is already saved, we can ignore the error
    //         if (err.code !== 11000) {
    //             throw err;
    //         }
    //         log.info(`URL already saved: ${title}`);
    //     });
});
