# Social DNA: product model, v2

## Purpose

Help a person find pleasant activities and compatible company. This is a preference profile, **not** a personality diagnosis, a measure of someone's worth, or a promise that an algorithm can know a person's complete character or worldview.

## Research behind the design

- Short Big Five measures can estimate broad traits, but the 15-item BFI-2-XS is not a detailed portrait of all facets. Wigo does not label people with Big Five scores from its own unvalidated questions. [Soto & John, 2017](https://www.sciencedirect.com/science/article/pii/S0092656616301325)
- Shared tastes can help people form social ties, but similarity is multidimensional and more similarity is not always proportionally better. Avoid a single “soulmate percentage.” [Lewis et al., 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3252911/), [Block & Grund, 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4267571/)
- An adaptive questionnaire chooses later questions using earlier answers. Wigo currently uses transparent rules, not calibrated Item Response Theory; do not claim psychometric precision until the bank has been validated with real respondents. [Meijer & Nering, 1999](https://journals.sagepub.com/doi/10.1177/01466219922031310)

## What a person sees

At most 18 questions, in this order: required age band, goal, a goal-specific follow-up, social energy, preferred group size, familiarity, connection style, valued qualities, comfort with differing views, planning rhythm, comfortable event budget (optional), payment expectations (optional, wording depends on group size), meeting times, activity category, concrete activity, one activity-specific follow-up, comfortable group composition (optional), and boundaries (optional).

The 540-question bank consists of 16 general questions, 4 goal branches, 10 category questions, and 5 follow-up variants for each of 102 activities. One person sees just one activity branch. Each branch is deterministic and can be changed by going back. The bank is a content bank, **not** 540 validated independent psychological items.

Money questions ask about event spending and expectations, never income or wealth. They do not presume that a man pays or a woman receives. A one-to-one meeting gets different wording than a group event. Age is required; group composition is optional; answers are private. Do not infer gender from payment preferences.

## Data and recommendations

Answers are stored in `profile_settings.social_dna`, which existing RLS restricts to the owner. Demo answers remain in memory. The result screen only describes explicit answers. Current event ranking uses title, format, seats, and time labels, because those are the fields the app already has. It cannot yet use ticket price, accessibility or verified attendance. Age rating, alcohol policy and public/private venue metadata are introduced by the age safety migration. A weak match should be displayed as a weak match.

Matching **people** requires a separate opt-in discovery system and server-side matching. The current `profile_settings` RLS intentionally prevents reading another person's DNA. Do not expose the JSON to clients merely to implement matching. Use consent, reciprocal preferences, block/report controls and privacy review before a people feed.

## Validation before broad release

1. Conduct interviews across ages, genders, incomes and activity interests. Check whether the language feels respectful and whether “skip” is easy to find.
2. Test every branch, including editing prior answers. Confirm that obsolete branch answers are discarded.
3. Measure completion time, drop-off by question, skipped sensitive questions, and whether users find the result recognisable.
4. Measure recommendation outcomes such as saves, join requests, attendance and post-event satisfaction. Compare against a time-and-location baseline. Avoid optimizing only clicks.
5. Before claiming psychological accuracy, study reliability, validity and group-specific measurement differences on an appropriately sampled population.

## Current limitations

The repository has no configured live Supabase environment for this checkout, so authenticated persistence and recommendations with real events need end-to-end verification. The 16+ policy below is implemented locally; live database enforcement requires the migration. The app does not currently include a matching feed for people.

## 16+ access policy

Under16 stops at the age question. For declared age16–17 and unknown age, recommendations require explicit16+, no alcohol and a public venue, with an additional adult-format title filter. Teen public/noAlcohol boundaries cannot be removed by an answer. Adult organizer access is required. These are self-reported age groups, not verified identity or age.

Apply supabase/migrations/20261008171111_dna_age_safety.sql before deploying this client. It adds event metadata and RLS restrictions for event reads, participation, organizer actions, addresses and chats. Existing events default to unknown; organizers must classify them. The migration has not been applied or integration-tested against a running database in this checkout.

Read the complete Russian question bank in DNA_QUESTIONS_RU.md. Regenerate it with node scripts/export-dna.cjs. This is a first editorial version; category follow-ups reuse shared templates. Wigo has not validated psychometric accuracy or released people matching.
