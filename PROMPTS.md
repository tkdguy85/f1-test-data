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
