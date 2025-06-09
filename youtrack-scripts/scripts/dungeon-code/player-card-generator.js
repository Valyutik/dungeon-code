const entities = require('@jetbrains/youtrack-scripting-api/entities');

// === 🛠 CONFIGURATION ===

const PLAYER_PROJECT_KEY = 'DC';         // Project key with player cards

const DEFAULT_STATUS = 'Alive';          // Initial player status
const DEFAULT_HP = 16;                   // Default HP
const DEFAULT_XP = 0;                    // Default XP
const DEFAULT_LEVEL = 1;                 // Default level

// === END CONFIGURATION ===

exports.rule = entities.Issue.onChange({
    title: 'Create player card if not exists',
    guard: (ctx) => {
        return !!ctx.issue.fields.Assignee;
    },
    action: async (ctx) => {
        const user = ctx.issue.fields.Assignee;
        const playerProject = entities.Project.findByKey(PLAYER_PROJECT_KEY);

        const cardExists = !!playerProject.issues.find(i =>
            i.fields.Player && i.fields.Player.login === user.login
        );

        if (!cardExists) {
            const card = await new entities.Issue(user, playerProject, user.fullName);

            card.fields.Status = DEFAULT_STATUS;
            card.fields.HP = DEFAULT_HP;
            card.fields.Player = user;
            card.fields.XP = DEFAULT_XP;
            card.fields.Level = DEFAULT_LEVEL;

            await card.save();
        }
    },
    requirements: {
        Assignee: {
            type: entities.User.fieldType,
            name: 'Assignee'
        }
    }
});