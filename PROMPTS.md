# Notes on Claude use

Using this as a dumping ground for any prompts that will be given to either Claude or Co-Pilot. This won't be a truly "vibe coded" app, but I do want to see how well I can co-exist with something that's already been adding additional data when I've asked it not to (for example, making up missing tire data for Day 3 testing runs).

## Prompts

First prompt of the project

```plain-text
I have spun up a React App with ChartJS as the library and I do not plan on using Tailwind styling, just modern CSS. I'll be providing you with 4 json files that I do not need to be altered in any way. If any pivotal information is missing, make a note of if and I'll address that research on my own. Do not manipulate any of the data from these files.

The purpose of this project is just to serve as a data visualization for the F1 Pre-season testing. Using ChartJS, I want to be able to set up visuals for the following
* comparisons of lap times across teams and drivers
* engine data comparison across the 5 manufactures
* team run data across the three days
* a simple bio card section in which you can click on a team an see chassis info, driver listings, and the team code

For any charts, regardless of the driver, use the color values from the teams object as the colors for the graphs

## Interesting Notes

Adding this section for anything that strikes me as odd or interesting.

Got these notes back after the first prompts were generated

```plain-text
Claude: A few things to note and one data flag I found:
A couple of data notes:

Mercedes original color (#010101) was near-invisible on dark backgrounds, so I swapped it to the team's well-known silver-teal (#6cd3bf) for visibility in charts. You may want to confirm the intended display color.
Cadillac's color (#f2f2f2) is very light on dark backgrounds, similarly adjusted to a neutral gray — flag this if you want the original value used.
Day 2 — Antonelli: Has only 3 laps recorded and no time set. The data as-supplied appears to indicate a session issue (likely a crash/red flag); I noted this in a banner rather than modifying anything.
