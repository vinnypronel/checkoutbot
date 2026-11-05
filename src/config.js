import { readFile } from "node:fs/promises";
export const RETAILERS = new Map([
  ["acehardware.com", "Ace Hardware"], ["www.acehardware.com", "Ace Hardware"],
  ["cvs.com", "CVS"], ["www.cvs.com", "CVS"],
  ["dollargeneral.com", "Dollar General"], ["www.dollargeneral.com", "Dollar General"],
  ["lowes.com", "Lowe's"], ["www.lowes.com", "Lowe's"],
  ["target.com", "Target"], ["www.target.com", "Target"],
  ["walmart.com", "Walmart"], ["www.walmart.com", "Walmart"],
  ["bestbuy.com", "Best Buy"], ["www.bestbuy.com", "Best Buy"],
]);
export const ALLOWED_HOSTS = new Set(RETAILERS.keys());
function parseEnv(text){for(const line of text.split(/\r?\n/)){const match=line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);if(match&&process.env[match[1]]===undefined)process.env[match[1]]=match[2];}}
export async function loadSettings(){try{parseEnv(await readFile(".env","utf8"));}catch(error){if(error.code!=="ENOENT")throw error;}const watchlistPath=process.env.WATCHLIST_PATH||"watchlist.json";const regionPath=process.env.REGION_PATH||"region.json";let watchlist,region;try{watchlist=JSON.parse(await readFile(watchlistPath,"utf8"));}catch(error){if(error.code==="ENOENT")throw new Error(`${watchlistPath} does not exist. Copy watchlist.example.json and add product URLs.`);throw error;}try{region=JSON.parse(await readFile(regionPath,"utf8"));}catch(error){if(error.code==="ENOENT")throw new Error(`${regionPath} does not exist. Copy region.example.json first.`);throw error;}if(!Array.isArray(watchlist.products)||!watchlist.products.length)throw new Error("The watchlist must contain at least one product.");for(const product of watchlist.products){const host=new URL(product.url).hostname.toLowerCase();if(!ALLOWED_HOSTS.has(host))throw new Error(`Unsupported retailer host: ${host}`);}return{products:watchlist.products,region,intervalMs:Math.max(60,Number(process.env.CHECK_INTERVAL_SECONDS||120))*1000,timeoutMs:Number(process.env.REQUEST_TIMEOUT_SECONDS||20)*1000,databasePath:process.env.DATABASE_PATH||"dropwatch-state.json",webhookUrl:process.env.DISCORD_WEBHOOK_URL||null,userAgent:process.env.USER_AGENT||"DropWatch/0.1 (+personal inventory monitor; manual checkout)"};}
