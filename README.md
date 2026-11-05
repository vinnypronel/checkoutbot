# DropWatch

DropWatch is an all-in-one retail drop assistant for finding limited products online
and at nearby physical stores. It monitors selected products, records price and
availability changes, ranks local-store leads by confidence, estimates resale profit,
and sends an immediate link so the user can complete checkout.

The project began with Pokémon products but is designed to support toys, trading cards,
tools, electronics, collectibles, household goods, and other retail categories.

> [!IMPORTANT]
> DropWatch provides fast detection and **assisted checkout**, not unattended purchasing.
> It does not submit payment, defeat CAPTCHAs, evade anti-bot systems, bypass queues or
> purchase limits, impersonate many shoppers, or conceal automation with proxy rotation.
> The user remains responsible for reviewing the item, seller, price, quantity, and order.

## Project goals

DropWatch is intended to answer four practical questions:

1. **Did a wanted product become available online?**
2. **Which nearby physical stores are most likely to have it right now?**
3. **How trustworthy is each inventory signal?**
4. **Is the purchase worthwhile after marketplace fees and shipping?**

The long-term product is one dashboard combining online monitoring, local-store
intelligence, community confirmations, price history, resale comparisons, alerts, and
a rapid browser handoff for checkout.

## Current capabilities

- Monitor individual product URLs.
- Recognize Walmart, Target, Best Buy, Dollar General, CVS, Lowe's, and Ace Hardware.
- Parse standard Schema.org product, offer, price, and availability information.
- Fall back to conservative visible-text availability detection.
- Enforce an allowlist of supported retailer domains.
- Apply a configured maximum purchase price.
- Prevent repeated alerts while an item remains continuously available.
- Send alerts to Discord or print them to the terminal.
- Save local observation state between runs.
- Configure a home region and preferred nearby towns.
- Estimate marketplace fees, shipping costs, net proceeds, profit, and ROI.
- Score evidence using source quality, freshness, exact-store matching, exact-product
  matching, observed quantity, and independent confirmations.

## Planned capabilities

The repository is an early foundation. These features require additional adapters,
authorized sources, UI work, and real-world validation:

- Web dashboard and mobile-friendly map.
- Store discovery by ZIP code and travel radius.
- Store-specific inventory history and restock timelines.
- UPC, SKU, model, TCIN, and retailer-ID matching.
- Community shelf reports with optional photo or receipt evidence.
- Negative confirmations such as “checked at 3:15 PM; shelf was empty.”
- Restock-day and time-window probability estimates per store and category.
- Push, email, SMS, and desktop notifications.
- Authorized marketplace comparison providers and completed-sale data.
- Product aliases and duplicate-listing resolution.
- Route planning for several high-confidence stores.
- One-click browser launch with the correct product and store selected.

Planned features are not represented as working until implemented and tested.

## Online drop workflow

```text
Watchlist
   │
   ▼
Conservative retailer checks ──► price and availability snapshot
   │
   ▼
Change detection ──► price cap and product validation
   │
   ▼
Alert ──► direct product link ──► user reviews and completes checkout
```

Speed comes from focused monitoring, deduplicated alerts, and a short handoff—not from
security circumvention. If a retailer blocks a request or presents a challenge,
DropWatch records an unknown result instead of attempting to bypass the control.

## Local-store intelligence

Online inventory is not the same as shelf inventory. Reported units might still be on a
truck, buried in a back room, misplaced, reserved, stolen, or already sold before the
public count updates. DropWatch treats retailer inventory as a lead rather than proof.

Every local observation should retain:

- Retailer and exact store identifier
- Address and distance from the configured region
- Exact product identifier and description
- Reported price and quantity, when available
- Observation timestamp and source
- Evidence type: retailer feed, public report, community text, photo, receipt, or staff
  confirmation
- Positive or negative result
- Confidence score and a human-readable explanation

Confidence labels are:

| Label | Meaning |
| --- | --- |
| `weak signal` | Old, vague, or single-source evidence; do not make a special trip. |
| `possible` | Relevant evidence exists, but shelf availability is uncertain. |
| `probable` | Recent, store-specific evidence makes a trip reasonable. |
| `high confidence` | Very recent strong evidence or independent confirmations. |

Confidence decreases as evidence ages. A recent receipt or exact-store shelf photo
outranks a retailer response. Independent confirmations are more valuable than several
copies of the same social-media post.

## Default region

The example configuration is centered on Elizabeth, New Jersey `07202`, with a 15-mile
radius. Priority towns include Elizabeth, Linden, Hillside, Union, Irvington, Newark,
Roselle, Rahway, Clark, Cranford, Westfield, Bayonne, and Kearny. The configuration can
be replaced for any other region.

## Price and resale analysis

DropWatch keeps retail cost separate from resale value:

```text
net proceeds = verified resale value - marketplace fees - shipping cost
profit       = net proceeds - retail purchase price
ROI          = profit / retail purchase price × 100
```

Price sources must be labeled honestly:

- **Retail price:** the current price charged by the store.
- **Active asking price:** what marketplace sellers currently request.
- **Completed-sale value:** prices from verifiable completed transactions.
- **Estimated net profit:** selected market value minus fees, shipping, and cost.

Active listings are not completed sales and must not be described as average resale
value. Fees, taxes, shipping, returns, condition, and variants can turn an apparent
margin into a loss.

## Community and public reports

Community reporting is the best path to stronger shelf accuracy. A future submission
form should let a user select the exact store, scan a UPC, enter shelf quantity, report
an empty shelf, and optionally attach a timestamped photo or receipt.

The repository includes `data/field-observations.json` for normalized, deduplicated
first-party store visits. Category-level reports without a UPC or retailer product ID
must keep `exactProduct` set to `false`; they cannot be promoted to exact-SKU evidence.

Public webpages may be indexed only when access and site rules permit it. Public social
posts are supporting signals, not verified inventory. DropWatch must not scrape private
Discord servers, restricted groups, logged-in accounts, or personal information without
permission. Reports should retain a source link while minimizing personal data.

## Retailer support

Retailer support is adapter-based because every site represents stores, products,
prices, and availability differently.

| Retailer | Domain | Product-page foundation | Store adapter |
| --- | --- | --- | --- |
| Walmart | `walmart.com` | Available | Planned |
| Target | `target.com` | Available | Planned |
| Best Buy | `bestbuy.com` | Available | Planned |
| Dollar General | `dollargeneral.com` | Available | Planned |
| CVS | `cvs.com` | Available | Planned |
| Lowe's | `lowes.com` | Available | Planned |
| Ace Hardware | `acehardware.com` | Available | Planned |

“Foundation available” means the domain and common structured product data are
recognized. It does not promise that every page can be read or that store inventory is
exposed. Store adapters require testing with real products and locations.

## Architecture

```text
src/
├── cli.js          Command-line entry point
├── config.js       Environment, watchlist, region, and retailer validation
├── parser.js       Structured product and availability parsing
├── monitor.js      Checks, change detection, and monitoring loop
├── state.js        Durable local observation state
├── notify.js       Discord and terminal alerts
├── confidence.js   Evidence quality and freshness scoring
└── profit.js       Fees, proceeds, profit, and ROI calculations

test/
├── parser.test.js
├── confidence.test.js
└── profit.test.js
```

The current implementation uses Node.js built-ins and has no third-party runtime
dependencies.

## Requirements and installation

- Node.js 22 or newer
- Internet access for live monitoring
- Optional Discord webhook
- Real retailer product URLs

```powershell
git clone https://github.com/vinnypronel/checkoutbot.git
Set-Location checkoutbot
Copy-Item .env.example .env
Copy-Item watchlist.example.json watchlist.json
Copy-Item region.example.json region.json
```

The local watchlist, region, environment, and state files are ignored by Git so webhook
secrets and personal configuration are not committed.

## Configuration

### Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `DISCORD_WEBHOOK_URL` | blank | Optional Discord notification destination. |
| `CHECK_INTERVAL_SECONDS` | `120` | Delay between checks; minimum 60 seconds. |
| `REQUEST_TIMEOUT_SECONDS` | `20` | Maximum time for one request. |
| `DATABASE_PATH` | `dropwatch-state.json` | Local observation state. |
| `WATCHLIST_PATH` | `watchlist.json` | Product watchlist. |
| `REGION_PATH` | `region.json` | Search-region configuration. |
| `USER_AGENT` | DropWatch identifier | Honest request identifier. |

### Watchlist example

```json
{
  "products": [
    {
      "name": "Example Pokémon product",
      "url": "https://www.walmart.com/ip/REPLACE_WITH_PRODUCT_ID",
      "maxPrice": 59.99
    }
  ]
}
```

### Region example

```json
{
  "center": { "city": "Elizabeth", "state": "NJ", "zipCode": "07202" },
  "radiusMiles": 15,
  "priorityTowns": ["Elizabeth", "Linden", "Union", "Hillside"]
}
```

## Usage

Check every configured product once:

```powershell
npm run check
```

Run continuously until stopped:

```powershell
npm start
```

Without a Discord webhook, qualifying alerts print to the terminal. State prevents
duplicate alerts while an item remains continuously eligible.

## Testing

```powershell
npm test
npm run lint
```

Tests cover retailer validation, structured parsing, price limits, availability
fallbacks, evidence freshness, independent confirmations, fees, profit, and ROI.

## Reliability principles

- Prefer `unknown` over a false in-stock claim.
- Show observation time on every inventory result.
- Separate online availability from physical-shelf confidence.
- Preserve exact store and product identifiers.
- Explain why a confidence score was assigned.
- Deduplicate reports copied from the same original source.
- Record negative confirmations and corrections.
- Never represent asking prices as completed-sale averages.
- Rate-limit checks and back off after errors.
- Do not bypass retailer security controls.

## Security and privacy

- Never commit webhooks, API keys, payment details, addresses, or account cookies.
- Use least-privilege credentials for future authorized APIs.
- Do not store card information or submit payments.
- Strip unnecessary personal information from community reports.
- Treat public reports and uploaded evidence as untrusted input.

## Responsible-use boundary

DropWatch helps an individual shop effectively without pretending to be many shoppers
or defeating retailer protections. The project will not include:

- CAPTCHA solving or challenge outsourcing
- Browser-fingerprint or bot-detection evasion
- Proxy rotation intended to avoid rate limits or bans
- Queue or virtual-waiting-room bypasses
- Purchase-limit or account-limit circumvention
- Concurrent automated checkout attempts
- Automatic cart, order, payment, or raffle submission
- Stored payment-card data

Fast alerts and direct browser handoff remain useful without those features.

## Roadmap

### Phase 1 — monitoring foundation

- [x] Retailer-domain validation
- [x] Structured product parsing
- [x] Price thresholds and deduplicated alerts
- [x] Region configuration
- [x] Profit and ROI calculations
- [x] Evidence confidence scoring

### Phase 2 — local inventory

- [ ] Store directory and distance model
- [ ] Dollar General, CVS, and Ace adapters
- [ ] Walmart and Target store-selection adapters
- [ ] Lowe's and Best Buy adapters
- [ ] Inventory history and probable-restock windows

### Phase 3 — dashboard and community evidence

- [ ] Responsive dashboard, map, and ranked store list
- [ ] UPC scanning and store check-ins
- [ ] Photo, receipt, and empty-shelf reports
- [ ] Source deduplication and abuse controls
- [ ] Push and email notifications

### Phase 4 — market intelligence

- [ ] Authorized marketplace integrations
- [ ] Completed-sale comparisons where permitted
- [ ] Variant-aware product matching
- [ ] Fee profiles and shipping estimates
- [ ] Confidence-adjusted net-profit ranking

## Research and licensing

Initial research reviewed public retail-automation repositories. Some mixed monitoring
with CAPTCHA solving, stealth browser changes, checkout automation, or payment
submission; those portions are outside DropWatch's scope. The reviewed retail-bot
repositories also lacked clear license files when inspected, so this implementation was
written originally instead of copied from them.

TCGdex may later enrich Pokémon alerts with set and card metadata, but it is a card-data
API rather than a retail inventory source.

## License

DropWatch is released under the [MIT License](LICENSE).

