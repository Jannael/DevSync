/*
To build the project this is how it works
1. Copy the template in the current directory (portfolio), where the DEVSYNC.json is.
2. Compile CV.astro component to static html.
3. Use puppeteer to convert the static html to pdf (CV).
4. Create README.md (Github Profile).
5. Create LinkedIn.md (LinkedIn Profile).
*/

/*
IMPORTANT: the portfolio must have a github action to run `devsync update` every time the users pushes to main branch.

Devsync update:
since the user should be able to change the style of cv and portfolio, update function won't modify or update the portfolio where the cv component is. Only will update Linkedin.md, README.md and create the CV pdf file.

The idea is the user to deploy his portfolio with vercel or cloudflare or netlify or any of those serverless providers, so when the user makes a push to the repo the provider will build and deploy the portfolio automatically. Like this everything is covered, portfolio, CV(will only create the pdf file not the cv component), Linkedin.md and README.md (these two will be overwritten).
*/

export interface BuildRepository {
  copyTemplate: () => Promise<void>
  readFile: ({ path }: { path: string }) => Promise<string>
  getHTMLFromComponent: ({ component }: { component: string }) => Promise<string>
  createPDF: ({ html, path }: { html: string; path: string }) => Promise<void>
  writeFile: ({ path, data }: { path: string; data: string }) => Promise<void>
}
