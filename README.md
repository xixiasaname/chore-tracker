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
- **Google Sheets sync**: all data and config stored in your own spreadsheet; works across device


## Notes

- Passwords are stored in plain text (suitable for a trusted family context, not for public accounts)
- The parent password lives in `index.html`; kid passwords are managed via the Admin panel and stored in your Google Sheet's `config` tab

## Demo
- Parent as admin: Log in -> Admin -> Add or edit Kid users and tasks
<img width="1870" height="919" alt="image" src="https://github.com/user-attachments/assets/9b531a92-474d-44f8-bb1e-fb8541e0af1d" />
<img width="1855" height="965" alt="image" src="https://github.com/user-attachments/assets/fda51048-3e8f-4d25-8512-4824061b0c5f" />
<img width="1883" height="837" alt="image" src="https://github.com/user-attachments/assets/0977c4a6-88fa-4412-baab-75c0ef60b721" />
- Kid: Log in -> choose task for chore track -> wait for parent approval
<img width="1869" height="929" alt="image" src="https://github.com/user-attachments/assets/32843693-4a1f-4e6b-8d24-59feb87e057f" />
<img width="1727" height="881" alt="image" src="https://github.com/user-attachments/assets/f47e8cb0-e3e8-4a0e-9054-d8f53d5048fb" />
- 
<img width="1878" height="863" alt="image" src="https://github.com/user-attachments/assets/ed8452e8-3983-41f5-992f-3d9d064782b8" />
<img width="1877" height="786" alt="image" src="https://github.com/user-attachments/assets/d4ae390a-e0e7-4083-96af-340a3ae24554" />
<img width="1872" height="903" alt="image" src="https://github.com/user-attachments/assets/060822f9-8d72-461f-96c2-65e3e3fa8349" />
<img width="1209" height="201" alt="image" src="https://github.com/user-attachments/assets/607df8a4-2612-4417-97ae-545017221d2f" />


