# Hoagie Mail
This is the repository for Hoagie Mail, a web app that sends 
emails to undergraduate and graduate listservs. It supports authentication using JWT tokens through the Hoagie and CAS system.

## Local Development
1. First, clone the repository with the following. You will need to [setup GitHub SSH keys](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) to successfully run this command. 
```
git clone https://github.com/HoagieClub/mail.git
```
2. Run the [Hoagie API](https://github.com/HoagieClub/api) locally.
3. Rename `.env.local.txt` file to `.env.local'
4. Get the dependencies with:
```
yarn
```
5. You can now run the server with
```
yarn dev
```
That's it! Hoagie Mail can now be accessed with `http://localhost:3000`.

## VSCode
We use VSCode for development. Please install the following packages:

1. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
1. [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)

ESLint is particularly important, if everything is installed correctly, it will allow you to see style errors inside the editor which we use to make sure our code is tidy and consistent throughout the codebase (same as output from `yarn lint`).
## Contribution
**Always create new branches when adding new features.** For example, let's say I am adding a delete button. I would do:
```
# Switch to new branch called delete-button
git checkout -b delete-button
```

When the main branch get updated, you want to run the following:
```
# If there were any new commits, rebase your development branch, for example delete-button
git checkout delete-button
git pull --rebase main
```
You may have to deal with merge conflicts; this will be visible and easier to deal with in VSCode. Here's a [short video about how to do it](https://www.youtube.com/watch?v=QmKdodJU-js).
```