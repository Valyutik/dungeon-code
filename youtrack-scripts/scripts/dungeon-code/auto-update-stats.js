const entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
    title: 'Auto-update Stats field when HP, XP or Level change',
    guard: (ctx) => {
        const issue = ctx.issue;
        return issue.project.shortName === 'DC' &&
            (
                issue.isChanged('HP') ||
                issue.isChanged('XP') ||
                issue.isChanged('Level')
            );
    },
    action: (ctx) => {
        const issue = ctx.issue;
        const hp = issue.fields.HP || 0;
        const xp = issue.fields.XP || 0;
        const level = issue.fields.Level || 1;

        issue.fields.Stats = `❤️${hp}| ⭐${xp}| 🎚️${level}`;
    },
    requirements: {
        HP: {
            type: entities.Field.integerType,
            name: 'HP'
        },
        XP: {
            type: entities.Field.integerType,
            name: 'XP'
        },
        Level: {
            type: entities.Field.integerType,
            name: 'Level'
        },
        Stats: {
            type: entities.Field.stringType,
            name: 'Stats'
        }
    }
});