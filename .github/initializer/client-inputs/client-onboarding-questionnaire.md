# Client Onboarding Questionnaire

Use this questionnaire to tell us what your team needs. You do not need to know the internal structure of this enabler or use technical terms perfectly. If something is unclear, write “not sure” and we will interpret it from the rest of your answers.

## 1. Client and Project Basics

**1. What is the name of your company or client team?**  
Example: `Verizon`

**2. What is the name of the project or application we will support?**  
Example:  `Sales Improvement`

**3. What kind of work do you want this enabler to help with?**  
Example: `feature development`, `testing support`, `documentation`, `audit review`, `process diagrams`, `all of the above`

## 2. Technology Used by Your Team

**4. Which programming languages does your project use?**  
Example: `Java`, `Spring Webflux`, `TypeScript`, `React`, `Cassandra`, `SQL`

**5. Which frameworks or libraries does your team use most often?**  
Example: `React`, `Angular`, `Spring Boot`, `Node.js`

**6. What kind of testing tools or test approach do you use?**  
Example: `JUnit`,  `Vitest`, `Playwright`, `Selenium`, `manual testing`

**7. What kind of database or data storage do you use?**  
Example: `Oracle`, `Cassandra`

**8. Where is the application usually hosted or deployed?**  
Example:  `AWS`, `on-premises servers`, `Kubernetes`

## 3. What You Want the AI to Produce

**9. What types of outputs do you want from the AI?**  
Example: `implementation plans`, `code changes`, `test cases`, `review comments`, `release notes`, `workflow diagrams`, `analysis documents`

**10. What format do you want the output in?**  
Example: `Markdown`, `Excel`, `Word document`, `PDF`, `JSON`, `plain text`

**11. Do you have an example of a good output you want us to follow?**  
Example: `yes, we have a previous document`, `yes, I can share a sample`, `no, please create a standard format for us`

**12. How detailed should the output be?**  
Example: `short and direct`, `medium detail`, `very detailed`, `include step-by-step explanation`

## 4. Team Rules and Guardrails

**13. Are there any words, terms, or naming styles your team prefers?**  
Example: `use customer instead of user`, `call it claim instead of request`, `use camel case for file names`

**14. Are there any words, terms, or naming styles your team does not want to use?**  
Example: `do not use jargon`, `avoid abbreviations`, `do not use the word ticket`

**15. Are there any rules your team always follows?**  
Example: `always include screenshots`, `always add test evidence`, `always get approval before release`, `always use approved templates`

## 5. Security, Privacy, and Approval

**16. Are there any security or privacy requirements we should follow?**  
Example: `do not include personal data`, `mask account numbers`, `follow internal security review`, `use approved tools only`

**17. Does your team need any special approval before changes are made?**  
Example: `product owner approval`, `QA approval`, `security approval`, `no extra approval needed`

**18. Are there any tools or actions we should avoid?**  
Example: `do not use production data`, `do not change database scripts`, `do not create UI changes without design approval`

## How We Use Your Answers

We will use your answers to decide what needs to be changed or added in the enabler, such as:
- which standards should be universal
- which standards should be client-specific
- which capability files need to be created or updated
- which instructions, prompts, and profiles need to change
- which examples and output formats should be used for your team

## Submission Tip

If a question does not apply to your team, write `not applicable`. If you are unsure, write `not sure`. That is enough for us to continue.

## Script Input Option

You can use this questionnaire directly with the onboarding automation script if you provide answers on lines that start with `Answer:` under each question.

Example command:

`node .github/initializer/tools/onboard-new-client.js --input <completed-questionnaire-file> --sync-manifest`

You can also start from `.github/initializer/client-inputs/client-onboarding-response-template.md`.