
# 🔐 Security warning
⚠️ **Security note:** Never commit your real Apps Script URL to a public repo.
The `index.html` in this repo uses a placeholder. Add your own URL locally.

# 🎯 Built with...
## Built With
- Vibe coded with [Claude](https://claude.ai) — no traditional dev environment
- Google Apps Script as serverless backend
- Vanilla HTML/CSS/JS — zero dependencies, zero build step

## Why I Built This
A real problem in my household — my kids needed motivation for chores beyond "because I said so." 
Built in a weekend as a portfolio piece during my career transition into sustainable fintech.

# 🏠 Chore Coins 

A simple family chore tracker. Kids log completed chores, parents approve them, earnings are tracked. Backed by Google Sheets — no server needed.
专为家庭设计的家务追踪应用。孩子完成家务后记录任务，家长审批并发放零花钱和游戏时间奖励。

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

- **Kid view**: log chores, see pending/approved earnings and game time rewards
- **Savings goals**: kids set a savings goal, track progress with a visual bar, and pay out when reached
- **Two separate payout flows**: "Pay Out the Goal" (clears goal savings) and "Pay Out the Available" (pocket money) are independent — no mixing of accounts
- **Smart carry-over**: if a kid replaces a goal, saved amount carries over; surplus above the new goal target returns to available pocket money automatically
- **Parent view**: approve or delete entries, earnings charts by task and by kid
- **Admin panel** (parent only): add/rename/delete kids and tasks, set passwords and emoji icons
- **Google Sheets sync**: all data and config stored in your own spreadsheet; works across devices

## Google Sheets tabs

| Tab | Purpose |
|---|---|
| `chore_entries` | All chore logs and approval status |
| `config` | Kids, tasks, passwords (managed via Admin panel) |
| `goals` | Active and completed savings goals per kid |
| `transactions` | Full audit trail: saves, payouts, surplus returns |

## Notes

- Passwords are stored in plain text (suitable for a trusted family context, not for public accounts)
- The parent password lives in `index.html`; kid passwords are managed via the Admin panel and stored in your Google Sheet's `config` tab
- Never open `index.local.html` — that is your local credential file, gitignored by design

## How It Works
- 👑 Parent (Admin): Log in → **Admin panel**: add/edit kids, tasks, emojis and rewards
  <img width="480" height="1066" alt="Screenrecorder-2026-05-07-06-47-16-656-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/3340eaf3-0e2e-4134-a652-1a99a5211857" />

- 🐯 Kids:
- Log in → pick a chore from the task grid
- Earn coins and game time per task
- Save earnings toward a goal, track progress, pay out when reached
- Wait for parent approval
 <img width="480" height="1066" alt="Screenrecorder-2026-05-07-06-47-16-656-ezgif com-video-to-gif-converter(1)" src="https://github.com/user-attachments/assets/93324b44-b895-441a-ad8b-7afb382bc7ba" />

- 👑 Parent (Admin):
- Approve or delete pending chore entries
- View earnings summary per kid and total, with charts
 <img width="480" height="1066" alt="Screenrecorder-2026-05-07-06-47-16-656-ezgif com-video-to-gif-converter(1)" src="https://github.com/user-attachments/assets/0102b871-9f44-4f75-925a-185da2965627" />

- 📊 Google Sheets backend:
- All data stored in real time in your own Google Sheet — no server, no subscription
- Works across devices: kids log on laptop, parent approves on phone
- Full data visible and editable directly in the spreadsheet
<img width="1209" height="201" alt="image" src="https://github.com/user-attachments/assets/607df8a4-2612-4417-97ae-545017221d2f" />
