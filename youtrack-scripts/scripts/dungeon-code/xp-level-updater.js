// noinspection JSCheckFunctionSignatures

const entities = require('@jetbrains/youtrack-scripting-api/entities');
const workflow = require('@jetbrains/youtrack-scripting-api/workflow');

// === 🛠 CONFIGURATION ===

const PLAYER_PROJECT_KEY = 'DC';              // Project key with player cards
const XP_LEVEL_MULTIPLIER = 50;               // XP per level = level * this multiplier

const XP_REWARDS_BY_PRIORITY = {              // Experience for completing tasks by priority
    critical: 10,
    major: 5,
    normal: 3,
    minor: 1
};

const HP_BONUS_DICE = { count: 1, sides: 8 }; // When passing a level - roll for HP

// === END CONFIGURATION ===

exports.rule = entities.Issue.onChange({
    title: 'Accrue experience and level up',
    guard: (ctx) => {
        return ctx.issue.fields.isChanged(ctx.Stage) &&
            ctx.issue.fields.Stage.name === 'Done';
    },
    action: (ctx) => {
        const issue = ctx.issue;
        const assignee = issue.fields.Assignee;

        if (!assignee) {
            workflow.message("No assignee — no XP awarded");
            return;
        }

        const playerCard = findPlayerCardForUser(assignee);
        if (!playerCard) {
            workflow.message(`Player card not found for ${assignee.login}`);
            return;
        }

        const priority = issue.fields.Priority.name.toLowerCase();
        const xpGain = XP_REWARDS_BY_PRIORITY[priority] || 1;

        let currentXP = parseInt(playerCard.fields.XP);
        let currentLevel = parseInt(playerCard.fields.Level);
        let currentHP = parseInt(playerCard.fields.HP);

        currentXP += xpGain;
        playerCard.fields.XP = currentXP;

        const xpNeeded = XP_LEVEL_MULTIPLIER * currentLevel;
        if (currentXP >= xpNeeded) {
            const newLevel = currentLevel + 1;
            const hpBonus = rollDice(HP_BONUS_DICE.count, HP_BONUS_DICE.sides);
            const newHP = currentHP + hpBonus;

            playerCard.fields.Level = newLevel;
            playerCard.fields.HP = newHP;

            workflow.message(`${assignee.login} leveled up to ${newLevel}! HP +${hpBonus} (now: ${newHP})`);
        } else {
            workflow.message(`${assignee.login} gained ${xpGain} XP (total: ${currentXP}/${xpNeeded})`);
        }
    },
    requirements: {
        Stage: {
            type: entities.EnumField.fieldType
        },
        Priority: {
            type: entities.EnumField.fieldType,
            name: 'Priority'
        },
        Assignee: {
            type: entities.User.fieldType,
            name: 'Assignee'
        }
    }
});

function findPlayerCardForUser(user) {
    const project = entities.Project.findByKey(PLAYER_PROJECT_KEY);
    if (!project) {
        workflow.message('Player card project not found');
        return null;
    }

    return project.issues.first(issue =>
        issue.fields.Player && issue.fields.Player.login === user.login
    );
}

function rollDice(count, sides) {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
}