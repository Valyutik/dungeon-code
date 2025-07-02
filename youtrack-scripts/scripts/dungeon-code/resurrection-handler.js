const entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
    title: 'Resurrect player when status changed from Dead to Alive',
    guard: (ctx) => {
        const issue = ctx.issue;
        const oldStatus = issue.oldValue('Status');
        const newStatus = issue.fields.Status;

        return issue.project.shortName === ctx.settings.ProjectKey &&
            oldStatus && newStatus &&
            oldStatus.name === 'Dead' &&
            newStatus.name === 'Alive';
    },
    action: async (ctx) => {
        const card = ctx.issue;
        const player = card.fields.Player;

        card.fields.HP = ctx.setting.DefaultHP;
        card.fields.XP = 0;
        card.fields.Level = 1;

        notifyPlayerResurrected(player, ctx.setting.DefaultHP);
        notifyLeaderResurrection(card, player, ctx.setting.DefaultHP);

        await card.save();
    },
    requirements: {
        Status: {
            name: 'Status',
            type: entities.EnumField.fieldType,
            Alive: { name: 'Alive' },
            Dead: { name: 'Dead' }
        },
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
        Player: {
            type: entities.User.fieldType,
            name: 'Player'
        }
    }
});

// === NOTIFICATIONS ===

function notifyPlayerResurrected(player, maxHP) {
    player.notify(`[Dungeon Code] ✨ You have been resurrected!`, `
<p>✨ <strong>${player.fullName || player.login}, you have been brought back to life!</strong></p>
<p>❤️ HP fully restored to <strong>${maxHP}</strong></p>
<p>🧪 XP set to <strong>0</strong> and Level to <strong>1</strong></p>
<hr />
<p><em>Someone believes in you... Don’t disappoint them again!</em></p>
`);
}

function notifyLeaderResurrection(card, player, maxHP) {
    card.project.leader.notify(`[Dungeon Code] ⚡ Resurrection performed`, `
<p>🧙‍♂️ <strong>${player.fullName || player.login}</strong> was resurrected.</p>
<p>📈 Status changed to <strong>Alive</strong> and HP restored to <strong>${maxHP}</strong></p>
<p>🧪 XP reset to <strong>0</strong>, Level reset to <strong>1</strong></p>
<p>📌 Card: <a href="${card.url}">${card.id}</a></p>
`);
}