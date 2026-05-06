# Chore Coins 🏠

A simple family chore tracker. Kids log completed chores, parents approve them, earnings are tracked. Backed by Google Sheets — no server needed.

## Setup

### 1. Google Sheets + Apps Script

1. Create a new Google Sheet
2. Open **Extensions → Apps Script**
3. Replace the default `Code.gs` with the contents of `Code.gs` from this repo
4. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the `/exec` URL from the deployment

### 2. Configure `index.html`

At the top of the `<script>` block, fill in:

```js
const CONFIG = {
  scriptUrl:      "paste your /exec URL here",
  parentPassword: "choose a parent password"
};
```

Also set your kids' default passwords in `DEFAULT_CFG` (parents can change them later via the Admin panel once logged in).

### 3. Open

Open `index.html` directly in a browser — no build step or server needed.

## Features

- **Kid view**: log chores, see pending/approved earnings and game session rewards
- **Parent view**: approve or delete entries, earnings charts by task and by kid
- **Admin panel** (parent only): add/rename/delete kids and tasks, set passwords and emoji icons
- **Google Sheets sync**: all data and config stored in your own spreadsheet; works across devices

- <img width="1870" height="919" alt="image" src="https://github.com/user-attachments/assets/9b531a92-474d-44f8-bb1e-fb8541e0af1d" />


## Notes

- Passwords are stored in plain text (suitable for a trusted family context, not for public accounts)
- The parent password lives in `index.html`; kid passwords are managed via the Admin panel and stored in your Google Sheet's `config` tab
