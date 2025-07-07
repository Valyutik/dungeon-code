## 🚀 Getting Started

**Dungeon Code** is a app for JetBrains YouTrack that turns task management into a true adventure. Follow the steps below to set it up in your environment:

---

### 1. 📦 Install the Application

You can install Dungeon Code in two ways:

#### 🛒 Install via JetBrains Marketplace:

* Go to the [plugin page](https://plugins.jetbrains.com/plugin/27603-dungeon-code/edit) and click **"Install"**

#### 📁 Manual installation from GitHub:

* Download the [latest release archive](https://github.com/Valyutik/dungeon-code/releases/latest)
* Go to **Administration → Applications → Upload from ZIP** and select the downloaded archive

---

### 2. 🧱 Create a Project for Player Cards

* Create a dedicated **empty project** (e.g., `Dungeon Code`) — this will store player card data
* Remove all default fields and **detach any default apps or workflows**
* This allows you to fully control the structure and avoid conflicts

> 💡 This project will be used to store HP, XP, and Level for each player.

---

### 3. 🛠 Configure Fields in Task Projects

* Go to the projects where you manage tasks
* Add the `Due Date` field and workflow (if not already present)
* Make sure the project includes the following fields:

  * `Priority`
  * `Assignee`
  * `Stage`

---

### 4. ⚙️ Configure Application Settings

* Go to **Administration → Applications → Dungeon Code**
* Enter the key of the player card project (e.g., `DC`)
* Save the settings

![App Settings](docs/images/App%20Settings.jpeg)

---

### 5. 🔌 Connect the App to Projects

* Open the **Projects** tab in Dungeon Code settings
* Connect:

  * the project with player cards (DC)
  * the projects where you manage tasks

---

### 6. ⚙️ Configure Workflows

* Go to **Technical Details → Open Workflow Settings**
* Ensure all modules are active and linked to the appropriate projects:

| Module                  | Purpose                            | Apply to Project    |
| ----------------------- | ---------------------------------- | ------------------- |
| `xp-level-update`       | Grants XP and levels up players    | Task projects       |
| `health-damage-applier` | Deals damage for overdue tasks     | Task projects       |
| `player-card-generator` | Automatically creates player cards | Task projects       |
| `resurrection-handler`  | Handles revival on status change   | Player card project |
| `auto-update-stats`     | Updates the visual stats field     | Player card project |

---

### 7. 🧩 Auto-Add Fields

* Once workflows are activated, YouTrack will prompt you to **add missing fields**
* Accept the changes and verify that all fields are present in the appropriate projects

---

### 8. 🧾 Manually Configure Player Card Fields

* Go to **Projects → Player Card Project → Fields**
* Ensure that all necessary fields are added and properly configured:

  * `HP` (integer)

  ![HP Field Settings](docs/images/HP%20Field%20Settings.jpeg)

  * `XP` (integer)

  ![XP Field Settings](docs/images/XP%20Field%20Settings.jpeg)

  * `Level` (integer)

  ![Level Field Settings](docs/images/Level%20Field%20Settings.jpeg)

  * `Player` (user field)

  ![Player Field Settings](docs/images/Player%20Field%20Settings.jpeg)

  * `Status` (enum with values `Alive`, `Dead`)

  ![Status Field Settings](docs/images/Status%20Field%20Settings.jpeg)

  * `Stats` (auto-updating text field to display summary)

  ![Stats Field Settings](docs/images/Stats%20Field%20Settings.jpeg)

---

### 9. 🧪 Configure Card Appearance

* Open the **Agile board** for the player card project
* Configure card display:

  * Use **Status** as the column grouping (Alive / Dead)
  * Enable the `Stats` field on the card view — it shows HP, XP, and Level

![Board Columns](docs/images/Board%20Settings%20Collumns.jpeg)

![Board Card](docs/images/Board%20Settings%20Card.jpeg)

---

### ✅ Done!

Now every completed task earns XP, while overdue tasks deal damage!
Track your teammates' progression and make sure nobody "dies" 🪦

---