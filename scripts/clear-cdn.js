const { join } = require("path");
const fetch = require("node-fetch");
require("dotenv").config({
    path: join(__dirname, "..", ".env")
})

if(process.env.NODE_ENV === "production") throw new Error("This script is not permitted to run in a prod environment.");
if(!process.env.CDN_ACCOUNT_ID || !process.env.CDN_TOKEN) throw new Error("Missing CDN acc ID or token.");
(async () => {
    const CDN_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CDN_ACCOUNT_ID}/images/v1`
    const headers = {
        "Authorization": `Bearer ${process.env.CDN_TOKEN}`
    }
    const allImages = await fetch(CDN_URL, {
        method: "GET",
        headers
    }).then(x => x.json());
    for(let i = 0; i < allImages.result.images.length; i++) {
        let image = allImages.result.images[i]
        setTimeout(async () => {
            const req = await fetch(CDN_URL + `/${image.id}`, { method: "DELETE", headers });
            if(!req.ok) return console.log(`Error deleting ${image.id} ${JSON.stringify(await req.json())}`)
            console.log(`Deleted image ${image.id}`)
        }, 200 * i);
    }
    return void 0;
})();