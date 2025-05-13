# SIDEQUE$T

## Introducing SIDEQUE$T: 

11.5% of California’s youth (aged 16-24) were neither in school nor employed in 2024. There has been a decline of ~3 million students over last decade. Over 4 million Gen Zers are jobless due to "worthless degrees" What does all this mean? We need  a platform for people to make money without a degree.

The solution: SIDEQUE$T is a safe, user-friendly marketplace to connect job seekers to opportunities. Through a tag-based recommendation system, job seekers can display their main skills on their profile and SIDEQUE$T will recommend jobs they are most qualified for.

**Why SIDEQUE$T?**

- **Safe**: Unlike Craigslist, SIDEQUE$T authticates using Google, and has a clean + intutive UI. We have a backdoor admin account that flags inappropriate content and bans offensive users.

- **For job seekers AND posters**: Platforms such as Fiverr, Upwork, and Taskrabbit only focus on users posting their skills and what they can complete, rather than having actual task postings. LinkedIn is only for salaried jobs, not one-off tasks for quick cash.

- **Wide variety of skills allowed**: Another competitor, SideShift, markets itself as a platform that connects Gen Z with flexible, paid gigs in content creation, social media, and marketing. However, sidequest does not limit to just these fields. From haircuts to teaching surf lessons, you can complete someone's quest or find someone to complete yours.

**Join the SIDEQUE$T Community Today!**

Say goodbye to scraping enough money to get by every month or feeling like your skills are useless. On the flip side, say goodbye to overpaying for basic tasks you need one.

Get your money up.


## Getting Started (Development)

To clone:
Navigate to desired directory
```
git clone https://github.com/CSEN-SCU/csen-174-s24-project-edurent

cd into local folder

npm install 

// try the following to run development server
npm run dev

// if that doesn't work, then delete node_modules and run
npm install

// then try
npm run dev

```

## Environment file
Create a .env file in your root folder. Within this file:
```
GOOGLE_CLIENT_ID="<google client id>"
GOOGLE_CLIENT_SECRET="<google client secret>"
SECRET="<ImageKit secret>"
NEXT_PUBLIC_IK_PUBLIC_KEY="<ImageKit public key>"
NEXT_PUBLIC_IK_ENDPOINT="<ImageKit public endpoint>"
IK_PRIVATE_KEY="<ImageKit private key>"
NEXT_PUBLIC_MAPS_KEY="<Google maps public key>"
MONGODB_URL="<mongo db url>"
GITHUB_ID="<github client id>"
GITHUB_SECRET="<github client secret>"
NEXT_PUBLIC_PUSHER_APP_KEY="<pusher app key>"
PUSHER_APP_ID="<pusher app id>"
PUSHER_SECRET="<pusher app secret>"
STRIPE_PRIVATE_KEY="<stripe private key>"
STRIPE_SECRET_KEY="<stripe secret>"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="<stripe public key>"
```
## Running the app
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

https://sidequest-blue.vercel.app/
