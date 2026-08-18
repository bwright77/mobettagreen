# Requirements

Working requirements for the full R&B's Mo'Betta Green MarketPlace site. Source is the
discovery conversation with Beverly Grant on 14 August 2026, plus decisions made
immediately after. The static coming-soon page now live at mobettagreen.org stays up until
this build is ready, then this replaces it.

Items are marked **confirmed** (came out of discovery) or **proposed** (our
recommendation, not yet agreed). Keep that line honest — it's what stops the scope
conversation from drifting.

## Context

- Mo'Betta Green MarketPlace is a **for-profit** business.
- **Confluence Colorado has been fiscal agent since 2023.** Tax-deductible giving toward
  the program side runs through that existing agreement — no new structure required.
- The market **travels**. "Where is it this week" is the most-asked question.
- Two full-time staff, roughly fifteen volunteers. Anything that takes ongoing effort
  has to survive that.

## Sections

### Confirmed

| Section | Notes |
| --- | --- |
| RGC Day | Random Gestures of Compassion Day, **July 20**. State and city recognized. Gets its own section, not a calendar entry — feature the proclamations. Fixed annual date, so it anchors the yearly donation and press push. |
| Events | Juneteenth Freedom Celebration annually, plus recurring events. |
| Classes | Returning as the Mosaic campus expansion comes online. Needs registration. |
| Community Farm Dinners | Take registration online — decided in discovery. Historically unregistered because it was hard to manage by hand, which is the problem the system solves. |
| Partnerships | Highlight partner organizations. |
| Ranchers & producers | Link out to partner ranchers so people can buy direct. |
| Press | Articles about Miss Bev and the Marketplace. Starting set below. |
| Donations | Through Confluence, pointed at the program side. |

### Proposed

| Section | Notes |
| --- | --- |
| Market schedule | Where the market is this week. Should be the most prominent thing on the site and editable from a phone in under a minute. |
| Vendor application | Currently runs off a flyer pointing at a link. Real intake form, season terms, booth fees, waitlist. |
| Volunteer signup | |
| The story | Five Points, Northeast Park Hill, Seeds of Power Unity Farm. Miss Bev's own account, in her words. |
| Impact numbers | Produce moved, SNAP dollars matched, households served, youth employed, free classes held. Doubles as the sponsorship pitch and the grant report. |

## Functionality

**Confirmed**

- **Registration** for classes and Community Farm Dinners — one system serving both.
- **Donations**, routed through Confluence Colorado.
- **All content editable** by Beverly or a volunteer.

**Proposed**

- Pay-it-forward produce boxes — a customer buys a box for a neighbor who needs one.
- Season share presales, prepaid and redeemed at market through the season.
- Market sponsorships.
- Supporter membership, and merch as print-on-demand only.

## Stack

Next.js on Vercel, Postgres via Supabase, Payload for content, Stripe for money.

| Layer | Choice | Notes |
| --- | --- | --- |
| App & hosting | **Next.js on Vercel** | Already the deploy target — the coming-soon page ships there now. |
| Database | **Supabase Postgres** | Project `eiaimbjpvmkpwzwhbqmf`. |
| Content | **Payload CMS v3**, admin at `/admin` | Official [`@payloadcms/db-postgres`](https://payloadcms.com/docs/database/postgres) Drizzle adapter takes the Supabase connection string directly. |
| Auth | **Supabase Auth** | No hand-rolled session management. |
| Payments | **Stripe**, and only Stripe | Billing for recurring sponsorship and supporter membership; Checkout for class and dinner registration; Products, Checkout, and Stripe Tax for merch. |

**No Shopify.** Merch volume doesn't justify a storefront with inventory management behind
it. Stripe-native selling keeps one payment system, one dashboard, and one tax setup —
and Stripe Tax now applies cleanly, since nothing routes through a second checkout.
Revisit only if merch grows into real catalogue and inventory work.

**Registrations as Payload collections**, in the same database as the content — class and
dinner signups appear in the same panel Beverly uses to edit pages.

That is what satisfies **one admin for everything**: Payload's own panel is the single
admin, so there's nothing custom to build or maintain, and nothing separate for a
volunteer to learn. Two places to log into is the thing most likely to be abandoned after
launch.

Payload keeps its own admin users, which is a separate concern from Supabase Auth — admin
access for Beverly and volunteers, versus public accounts for anyone registering or
subscribing. Not a second login for her.

## Channel strategy

Facebook and Instagram carry the reach and stay the primary channel — the site does not
compete with them. The site holds what scrolls away: where to find the market, how to
vend, how to volunteer, what to buy, what's coming up. Post to Facebook, link to the site.

No email list program. It's a recurring cost and a recurring chore for a two-person
staff, and a list that isn't mailed regularly decays into nothing. Revisit only if
season shares create a real transactional need (pickup reminders for people who already
paid), which comes with the commerce tooling rather than as a separate program.

## Open

### Stack decisions

- **Which Stripe account receives donations.** Deductible gifts have to land with
  Confluence Colorado, not Mo'Betta Green — so the donate flow either links out to
  Confluence's own page or runs on a Stripe account belonging to Confluence, kept separate
  from the Mo'Betta Green account taking membership and sponsorship. Shane can settle this
  quickly.
- **Whether public accounts are needed at all.** Guest checkout may cover class and dinner
  registration outright. Accounts mean password resets and support requests landing on a
  two-person staff — worth only adding them if membership or saved registrations actually
  require it.
- **Where uploaded media lives.** Payload supports Supabase Storage and S3-compatible
  targets. Settle before the photo archive goes in, since moving it later means rewriting
  URLs.

### Client questions

- Does the site need Spanish?
- Who owns the photos and video, and are there releases for the people in them?
- Who on the client side keeps the site current once it's live?
- Which revenue path gets built first.
- Budget range and a launch date to work back from.
- Vector logo files, so the live page can retire the type-set wordmark
  (see the `.logo` block in [index.html](index.html)).
- Founding year — the coming-soon page says "Since 2010"; still unverified.
- Whether `mbgmanager@gmail.com` is the address to publish.

## Press

Found while researching the coming-soon page. Miss Bev likely has broadcast and print
that doesn't surface in a search — worth asking.

- [Rocky Mountain PBS](https://www.rmpbs.org/news/rocky-mountain-pbs/mo-betta-green) — 13th marketplace in Five Points
- [Westword](https://www.westword.com/restaurants/beverly-grant-of-mo-betta-green-marketplace-talks-about-food-deserts-and-urban-agriculture-5759197) — food deserts and urban agriculture
- [5280](https://www.5280.com/2015/06/beverly-grants-mo-betta-mission/) — "Beverly Grant's Mo' Betta Mission"
- [KUVO Jazz](https://www.kuvo.org/news/community-connection-beverly-grant-of-randb-mo-betta-green-marketplaces) — Community Connection interview
- [Big Green](https://biggreen.org/our-impact/mo-betta-green-marketplace/) — partner profile
- [Anthropocene Alliance](https://anthropocenealliance.org/mo-betta-green-marketplace-and-seeds-of-power-unity-farm/) — partner profile, Seeds of Power Unity Farm
