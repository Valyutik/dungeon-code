## 🚀 Getting Started

**Dungeon Code** is a gamified workflow system for JetBrains YouTrack that turns task completion into a real adventure. Follow the steps below to deploy it:

---

### 1. 📦 Installing the application

There are two ways to install Dungeon Code:

#### 🛒 Installation via JetBrains Marketplace:

* Go to the [plugin page](https://plugins.jetbrains.com/plugin/27603-dungeon-code/edit) and click **“Install”**

#### 📁 Manual installation from GitHub:

* Download the latest version of the archive (https://github.com/Valyutik/dungeon-code/releases/latest)
* Go to Administration → Applications → Upload from ZIP and select the downloaded archive

---

### 2. 🧱 Creating a project with player cards

* Create a separate **empty project** (for example, `Dungeon Code`) — it will store the data of all employees
* Delete all standard fields and **disable default applications and workflows** in the settings
* This will allow you to control the structure manually and avoid conflicts

> 💡 This project will be used to store each player's HP, XP, and level.

---

### 3. 🛠 Configuring fields in projects with tasks

* Go to the relevant projects where tasks will be tracked
* Add the `Due Date` workflow and the corresponding field (if it does not already exist)
* Make sure that the project has the `Priority`, `Assignee`, and `Stage` fields

---

### 4. ⚙️ Configuring application settings

* Go to **Administration → Applications → Dungeon Code**
* Enter the project key with cards (for example, `DC`)
* Save the settings

![App Settings](docs/images/App%20Settings.jpeg)

---

### 5. 🔌 Connecting the application to projects

* Go to the **Projects** tab in the Dungeon Code settings
* Connect:

* the project with cards (DC)
* projects with your tasks

---

### 6. ⚙️ Setting up workflows

* Go to **Technical Information → Go to workflow settings**
* Make sure all modules are active and linked to the right projects:

| Module                  | Purpose                   | Apply to project |
| ----------------------- | ---------------------------- | ------------------- |
| `xp-level-update`       | Awards XP and increases level | projects with tasks  |
| `health-damage-applier` | Inflicts damage for delays    | projects with tasks  |
| `player-card-generator` | Creates player cards      | projects with tasks  |
| `resurrection-handler`  | Resurrects when status changes | project with cards |
| `auto-update-stats`     | Updates visible statistics | project with cards |

---

### 7. 🧩 Automatic field addition

* After activating all workflows, YouTrack will offer to **add missing fields**
* Agree and check that all fields have been added to the desired project

---

### 8. 🧾 Manually configuring card fields

* Go to **Projects → Project with cards → Fields**
* Make sure that the following fields are added and configured correctly for player cards:

* `HP` (numeric)

  ![App Settings](docs/images/HP%20Field%20Settings.jpeg)

* `XP` (numeric)

![App Settings](docs/images/XP%20Field%20Settings.jpeg)

* `Level` (numeric)

  ![App Settings](docs/images/Level%20Field%20Settings.jpeg)

* `Player` (User)

![App Settings](docs/images/Player%20Field%20Settings.jpeg)

* `Status` (Enumeration: `Alive`, `Dead`)

  ![App Settings](docs/images/Status%20Field%20Settings.jpeg)

* `Stats` (automatically updated text field displaying a summary)

![App Settings](docs/images/Stats%20Field%20Settings.jpeg)

---

### 9. 🧪 Configuring card display

* In a project with cards, open the **Agile board**
* Configure card display:

* By **Status** field (Alive / Dead)
    * Enable the display of the `Stats` field, which shows HP, XP, and player level.

![App Settings](docs/images/Board%20Settings%20Collumns.jpeg)

![App Settings](docs/images/Board%20Settings%20Card.jpeg)

---

### ✅ Done!

Now each completed task brings experience, and overdue ones cause damage!
Watch your colleagues' progress and don't let them “die” 🪦

---