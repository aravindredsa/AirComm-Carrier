# Client Onboarding Response Template

Use this file format when running:

node .github/initializer/tools/onboard-new-client.js --input .github/initializer/client-inputs/client-onboarding-response-template.md --client-id your-client-id --dry-run

Remove sample values and fill your own answers.

## 1. Client and Project Basics

**1. What is the name of your company or client team?**
Answer: AirComm Carrier

**2. What is the name of the project or application we will support?**
Answer: Sales Improvement

**3. What kind of work do you want this enabler to help with?**
Answer: feature development, testing support, documentation

## 2. Technology Used by Your Team

**4. Which programming languages does your project use?**
Answer: Spring Boot, Spring Webflux, TypeScript, Cassandra

**5. Which frameworks or libraries does your team use most often?**
Answer: React, Spring Webflux

**6. What kind of testing tools or test approach do you use?**
Answer: Junit, Vitest, Playwright

**7. What kind of database or data storage do you use?**
Answer: Oracle, Cassandra

**8. Where is the application usually hosted or deployed?**
Answer: AWS, Google Cloud

## 3. What You Want the AI to Produce

**9. What types of outputs do you want from the AI?**
Answer: implementation plans, code changes, test cases, review comments

**10. What format do you want the output in?**
Answer: Markdown

**11. Do you have an example of a good output you want us to follow?**
Answer: yes, we can share prior approved templates

**12. How detailed should the output be?**
Answer: very detailed

## 4. Team Rules and Guardrails

**13. Are there any words, terms, or naming styles your team prefers?**
Answer: use claimant instead of user

**14. Are there any words, terms, or naming styles your team does not want to use?**
Answer: avoid abbreviations in external reports

**15. Are there any rules your team always follows?**
Answer: always include test evidence; always include assumptions

## 5. Security, Privacy, and Approval

**16. Are there any security or privacy requirements we should follow?**
Answer: mask personal identifiers, no production data in examples

**17. Does your team need any special approval before changes are made?**
Answer: product owner approval and QA approval

**18. Are there any tools or actions we should avoid?**
Answer: do not run destructive database operations without explicit approval
