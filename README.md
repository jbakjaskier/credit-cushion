# Credit Cushion

![image](https://github.com/user-attachments/assets/3db95beb-0546-4c26-b298-10bd0765ef5d)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Application Wireframes

1. Provider Selection Page

   ![image](https://github.com/user-attachments/assets/7aa1a924-84e3-48a9-b756-df310b846699)

2. Products Application Page

   ![image](https://github.com/user-attachments/assets/ee9144aa-4ed8-4771-ab5b-d5d9a03ccd57)
   
   

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Remaining TODOs: 

1. Hardship Form State UI
   - For the `emailSentToRepresentative` state - a UI must be implemented
   - When there is an error all the entered information is lost. To fix this send back the field info from the server action in the error state apart from just the message for each component. 

2. Adding a UI for the loan interface - this has be completed ✅

3. Ability to view and edit Variation Generated Before Sending to Customer - this has been completed ✅
   - This also involves updating the Db status

4. Update application routing in the top 
   - Currently it says Products and Customers when in reality it should be saying "Loans" and "Products"

5. Ability to display when a hardship requires action in the loan list

6. Add Footer

7. Add Products so that we can view the available products and then load it as a template

8. Add UI for when `hardship.loanVariationStatus` is `needsAttention` and have the UI to `resolve` it as well.. 
   - The `needsAttention` can resolve by going to `hardshipResolved`, however for the other two states -  for `variationGenerated` and `variationSent` - we will leave it as it is as it does not need resolving and the UI has hardship envelope details as well. 