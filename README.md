# Lergassy agent tools — one MCP server for 30 Apify Actors

Flight prices, hotel reviews, Threads and LinkedIn, Shopee, Lazada, Tokopedia, 1688 and Mercado
Libre, TikTok Shop, Zillow, US business filings, speech-to-text — as MCP tools your agent can call
directly. Every tool is a published Apify Actor that has been running for paying buyers, not a demo.

**You pay per delivered row, and nothing at all when the answer is empty.** No start fee, no
subscription, no proxy bill. The run is billed to *your* Apify account, so you see every cent in your
own console.

## Install

Get a token at [console.apify.com → Integrations](https://console.apify.com/settings/integrations).
The free plan includes monthly usage credit, so you can try every tool here without paying anything.

### Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "lergassy-agent-tools": {
      "command": "npx",
      "args": ["-y", "github:lergassy/lergassy-agent-tools"],
      "env": { "APIFY_TOKEN": "apify_api_..." }
    }
  }
}
```

### Cursor, Windsurf, Gemini CLI, any MCP client

Same three lines: command `npx`, args `-y github:lergassy/lergassy-agent-tools`, env `APIFY_TOKEN`.

Not on npm yet — install straight from this repository, which is what the command above does.

## Settings

| Variable | Default | What it does |
|---|---|---|
| `APIFY_TOKEN` | — | Required. The run is billed to this account. |
| `MAX_ROWS` | `50` | Rows returned to the model per call. The full dataset always stays in Apify. |
| `RUN_TIMEOUT_SECS` | `300` | How long a single Actor run may take. |

## Tools

### Flights and hotels

- **`google-flights-scraper`** — [$1/1K rows] Google Flights scraper: fares, the full 100-150 itinerary list, price calendar up to a year, Explore destinations, layovers, CO2, booking options with seller links. Round trip, 
- **`kayak-flights-scraper`** — Scrape flight prices from KAYAK by route and dates: price per booking provider, airline, flight numbers, times, duration, stops and layovers, aircraft and a direct booking link. One-way and 
- **`booking-hotels-scraper`** — Scrape Booking.com hotel search: nightly and total prices for your dates, every room and rate with cancellation terms, guest reviews, facilities and a year of availability. Hotel search data
- **`agoda-reviews-scraper`** — Scrape hotel guest reviews and ratings from Agoda, including the Booking.com review pool on the same page: rating, text, traveler type, room booked, length of stay, reviewer country and date

### Threads and social

- **`threads-scraper`** — Threads scraper and Threads API alternative: scrape Meta Threads posts, replies, reposts, profiles, and keyword or hashtag search without a login. Threads data arrives as flat rows with enga
- **`threads-search-scraper`** — Search Meta Threads by keyword or hashtag and get every public post as a row: text, author, time, likes, replies, reposts, images, videos, links and mentions. Top, recent and tag pages in on
- **`threads-replies-scraper`** — The replies side of Threads as rows: every reply an account wrote with the post it answered, every reply under a post URL, and reposts. Text, author, time, engagement, media, links and reply
- **`meta-ad-library-scraper`** — Scrape Facebook and Instagram ads from Meta's Ad Library by keyword or advertiser page: ad text, headline, call to action, link, image and video URLs, format, platforms and run dates. One fl

### LinkedIn and hiring

- **`linkedin-profile-scraper`** — [$3/1K profiles] LinkedIn profiles without login or cookies: name, headline, current title and company, location, about, followers, connections, full experience with dates, education, websit
- **`linkedin-profile-details-scraper`** — Scrape LinkedIn profile details in bulk from profile URLs, no login or cookies: headline, current title and company, location, about, followers, experience with dates, education, skills, cer
- **`linkedin-company-jobs-scraper`** — Scrape all open LinkedIn jobs of any company without login: paste a company URL, ID or name and get every job with title, location, posting date, seniority, employment type, applicants, sala
- **`linkedin-profile-email-finder`** — Find the verified work e-mail of LinkedIn profiles, no login or cookies: the company website, its address layout and an SMTP mailbox check, plus the full profile with title, company and expe

### Marketplaces

- **`shopee-scraper`** — Shopee scraper and Shopee API alternative for product data from all 11 marketplaces: price, original price, discount, rating, shop name and rating, seller city, promo labels, plus product de
- **`lazada-scraper`** — Scrape Lazada data from all six Southeast Asian marketplaces: search results, full product pages and reviews. Price, discount, rating, sold count, seller, image gallery and every variant wit
- **`tokopedia-reviews-scraper`** — Scrape Tokopedia products with price, discount, units sold, seller tier, COD and offer labels, plus shop and product reviews with photos. Monitor mode returns only what changed since the las
- **`mercadolibre-reviews-scraper`** — Extract Mercado Libre and Mercado Livre data from all 18 Latin American marketplaces: products, prices, discounts, sellers, official stores, daily deals and buyer reviews with ratings and ph
- **`1688-scraper`** — Scrape 1688.com, China's wholesale market, without a login: keyword search in English or Chinese, full product pages with variants and specs, image search by photo, and factory and wholesale
- **`1688-image-search-scraper`** — Find any product on 1688.com by photo: paste image links from Amazon, AliExpress, Shopify or your own pictures and get the matching factory listings with price in CNY and USD, units sold, re
- **`1688-product-details-scraper`** — Scrape full 1688.com product pages by URL or ID: price range in CNY and USD, minimum order, stock, units sold, variants with images, specifications, shipping weight, ship-from city, services
- **`au-grocery-scraper`** — Scrape Australian grocery prices from Coles, Woolworths and ALDI in one run: price, was-price, discount, unit price, stock, category, ingredients and nutrition. Compare the three chains on o

### TikTok Shop

- **`tiktok-shop-top-products-scraper`** — Scrape TikTok Shop best-selling products with revenue (GMV), units sold, average price, growth, the video / live / shop-window split and affiliate commission in 15 markets. Search by keyword
- **`tiktok-shop-videos-scraper`** — Scrape TikTok Shop shoppable videos that sell: revenue (GMV), views, ad ROAS, likes, shares, comments, ad and AI-generated flags in 15 markets. Find them by keyword, category, product, creat

### Property and companies

- **`zillow-scraper`** — Scrape Zillow sold homes with sold price and sold date, plus homes for sale and rentals — past the 820-result cap. One flat row per home: price, beds, baths, sqft, Zestimate, price history, 
- **`us-business-filings`** — New business leads from official open data: newly registered companies from state registries, new business licences in major cities, and funded startups from SEC Form D filings. Every phone 

### Video and speech to text

- **`whisper-transcriber`** — Whisper large v3 transcription, no API key: paste a YouTube, TikTok, Vimeo or SoundCloud link, or an MP3, WAV, M4A, FLAC, OGG, MP4 or MOV file, and get clean text with timecodes in 90+ langu
- **`tiktok-reels-shorts-transcript-scraper`** — One run for all three platforms: YouTube Shorts, TikTok and Instagram Reels turned into text — transcript with timestamps, on-screen captions and the first-3-second hook. Shorts use YouTube'
- **`instagram-reels-transcript-scraper`** — Instagram Reels, TikTok and YouTube Shorts to text: speech-to-text transcript with timestamps, burned-in captions, the 3-second hook, likes, views and a viral score vs the author's usual. No
- **`youtube-comments-scraper`** — Scrape YouTube comments and replies from videos, whole channels, playlists or a YouTube search: text, likes, creator hearts, pinned flag, reply count, commenter channel and video stats. Sort

### Sport

- **`sports-odds-api`** — Moneyline, spread and total odds per book — Pinnacle sharp lines with the risk limit it accepts, DraftKings, Kalshi — plus arbitrage and value bets calculated across books, opening lines, pr
- **`tennis-scores-api`** — Tennis scraper on SofaScore data: live scores, schedules, results, match statistics, point by point, betting odds, ATP and WTA rankings, player profiles and draws for ATP, WTA, Challenger, I

## How it answers

- Rows come back as JSON, with the Actor's own run summary on top — how many rows were delivered and
  what was charged.
- When an Actor finds nothing it says why in its own words (wrong filter, private profile, no
  results for that phrase) instead of returning an empty array. Nothing is charged for an empty answer.
- When Apify refuses a run, the server passes the platform's own message through untouched rather
  than guessing at the reason.

## Keeping the tool list in sync

`npm run sync` rebuilds `src/tools.json` from each Actor's live input schema on Apify, so a tool's
arguments always match what the Actor really accepts.

## Who makes these

[lergassy](https://apify.com/lergassy) and [BlueskyScraper](https://apify.com/blueskyscraper) on the
Apify Store — 211 public Actors, fixed on the day a buyer reports a problem. Found a bug? Open an
issue here or leave a review on the Actor's store page.

MIT licence.
