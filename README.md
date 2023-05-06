# Hoagie Mail
This is the repository for Hoagie Mail, a web app that sends 
emails to undergraduate listservs. It supports authentication using JWT tokens through the Hoagie and CAS system.

## Local Development
1. First, clone the repository with the following. You will need to [setup GitHub SSH keys](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) to successfully run this command. 
```
git clone https://github.com/HoagieClub/mail.git
```
2. Run the [Hoagie API](https://github.com/HoagieClub/api) locally.
3. Rename `.env.local.txt` file to `.env.local` and get the keys from Liam or another club member.
4. Get the dependencies with:
```
yarn
```
5. You can now run the server with
```
yarn dev
```
That's it! Hoagie Mail can now be accessed with `http://localhost:3000`.

## Branches
Create a new branch that describes your task, for example:
```
git branch -m course-support
```