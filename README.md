# Pokemon DropWatch

Pokemon DropWatch is a personal, notification-only inventory monitor for individual
product pages on Walmart, Target, Best Buy, Dollar General, CVS, Lowe's, and Ace Hardware. It detects availability and price,
sends a Discord alert when a product becomes eligible, and links you to the retailer
for **manual checkout**.

## Guardrails

This project intentionally does not automate cart or payment actions, solve CAPTCHAs,
rotate proxies, evade anti-bot controls, bypass queues or purchase limits, or run
concurrent checkout tasks. Use it conservatively and follow each retailer's terms.
The monitor enforces a minimum 60-second interval.

## Quick start

Requires Node.js 22 or newer. There are no third-party runtime dependencies.

```powershell
Copy-Item .env.example .env
Copy-Item watchlist.example.json watchlist.json
Copy-Item region.example.json region.json
```

Edit `watchlist.json` with real product URLs and price caps. Add an optional Discord
webhook to `.env`, then run one check:

The included region template is centered on Elizabeth, NJ 07202 with a 15-mile radius.
Retailer price can be compared with a verified resale value using the fee, shipping,
net-profit, and ROI calculations in `src/profit.js`. Active listing prices must not be
labeled as completed-sale averages.

```powershell
npm run check
```

Run continuously with:

```powershell
npm start
```

Without a Discord webhook, alerts print to the terminal. State is stored in a local JSON file,
so repeated checks do not send duplicate alerts while an item remains available.

## How parsing works

The parser prefers standard Schema.org JSON-LD product and offer data. It has a small
visible-text fallback for availability phrases. Retail pages change frequently, so an
`unknown` result is safer than guessing. Add store-specific adapters and saved HTML
fixtures as the next step when a real product URL exposes a different public shape.

## Research notes

- `ThomasCantuti/Checkout-bot-Card-Collection` mixes monitoring with CAPTCHA solving,
  stealth browser modifications, automated checkout, and payment submission. Those
  portions are deliberately outside this project's scope.
- `alex6499cat/purchase-bot` is an old Puppeteer experiment (latest checked commit from
  April 2021) and its own README calls the flow error-prone.
- `jasonzenarosa/pokemon-card-bot` is the closest conceptual reference: price polling
  plus Discord notification, but it is a single-product script.
- `TCGdexBOT` is a bot account for the TCGdex open card database/API, not a retail
  checkout bot. TCGdex can later enrich alerts with set/card metadata.

The three retail-bot repositories above did not contain license files when reviewed,
so this implementation is original rather than copied or forked from them.

## Test

```powershell
npm test
npm run lint
```

