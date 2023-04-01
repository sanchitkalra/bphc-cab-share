# BPHC Cab Share

A simple application for students of BPHC to find others to pool cabs with. Enter your ideal departure time and the time you’re willing to wait (coming to campus) and the time you’re willing to go early (going from campus) and easily find someone who schedule aligns with yours.

## Stack

1. NextJS
2. TypeScript
3. Supabase for database and authentication
4. Google Auth
5. Firebase for notifications (WIP)
6. TailwindCSS
7. Vercel

## Places

1. Campus
2. Airport
3. Railway Station

## Local Development

To develop locally you will need both Supabase and Firebase projects to begin. Create project on both platforms and then follow the instructions.

To run locally, first get the source by running the following commands:

1. `git clone https://github.com/sanchitkalra/bphc-cab-share.git`
2. `cd bphc-cab-share`

Now, populate your .env.local file as specified in the sample env file by getting your config from both Supabase and Firebase.

Now run the project with:

1. `yarn`
2. `yarn dev`

Find a sample env file at [.env.sample](/.env.sample)
