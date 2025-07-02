const entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
    title: 'Create player card if not exists',
    guard: (ctx) => {
        return !!ctx.issue.fields.Assignee;
    },
    action: async (ctx) => {
        const user = ctx.issue.fields.Assignee;
        const playerProject = entities.Project.findByKey(ctx.settings.ProjectKey);

        const cardExists = !!playerProject.issues.find(i =>
            i.fields.Player && i.fields.Player.login === user.login
        );

        if (!cardExists) {
            const card = await new entities.Issue(user, playerProject, user.fullName);

            card.fields.Status = 'Alive';
            card.fields.HP = ctx.settings.DefaultHP;
            card.fields.Player = user;
            card.fields.XP = 0;
            card.fields.Level = 1;

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