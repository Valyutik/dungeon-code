// noinspection JSCheckFunctionSignatures
const entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onSchedule({
    title: 'Do damage for overdue tasks',
    cron: '0 0 0 * * ?',
    search: '#Unresolved has: {Due Date}',
    action: (ctx) => {
        const project = entities.Project.findByKey(ctx.settings.ProjectKey);
        const issue = ctx.issue;

        if (!project) {
            notifyProjectNotFound(ctx.project.leader);
            return;
        }

        const now = new Date();

        if (
            issue.fields.Assignee &&
            issue.fields.DueDate && issue.fields.DueDate < now &&
            issue.fields.Stage && issue.fields.Stage.name !== 'Done'
        ) {
            const user = issue.fields.Assignee;

            const playerCard = project.issues.first(i =>
                i.fields.Player && i.fields.Player.login === user.login
            );

            if (!playerCard) {
                notifyCardNotFound(project.leader, user);
                return;
            }

            const damage = rollDice(ctx.settings.DamageDiceCount, ctx.settings.DamageDiceSides);
            let currentHP = parseInt(playerCard.fields.HP);
            currentHP = Math.max(0, currentHP - damage);
            playerCard.fields.HP = currentHP;

            notifyDamage(playerCard.fields.Player, user, damage, issue, currentHP);

            if (currentHP === 0) {
                playerCard.fields.Status = 'Dead';
                notifyDeathToPlayer(playerCard.fields.Player, user);
                notifyDeathToLeader(project.leader, user, issue, playerCard);
            }
        }
    },
    requirements: {
        Assignee: {
            type: entities.User.fieldType,
            name: 'Assignee'
        },
        DueDate: {
            type: entities.Field.dateType,
            name: 'Due Date'
        },
        Stage: {
            type: entities.EnumField.fieldType,
            name: 'Stage'
        }
    }
});

function rollDice(count, sides) {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
}

// === NOTIFICATIONS ===

function notifyProjectNotFound(leader) {
    leader.notify('[Dungeon Code] ❗ Project search error', `
<p>🚨 <strong>Project with player cards (<code>${PROJECT_KEY}</code>) not found</strong></p>
<p>The script couldn't apply the damage due to not having the right project.</p>
<p><em>Script:</em> <code>health-damage-applier.js</code></p>`);
}

function notifyCardNotFound(leader, user) {
    leader.notify(`[Dungeon Code] ❗ Player card not found`, `
<p>🧍 <strong>No player card found for user <code>${user.login}</code></strong></p>
<p>The script tried to apply damage for an overdue task, but couldn’t find a linked player card in project <code>${PROJECT_KEY}</code>.</p>
<p>Please create one manually or check the automatic card creation logic.</p>
<hr />
<p><em>Script:</em> <code>health-damage-applier.js</code></p>`);
}

function notifyDamage(player, user, damage, issue, currentHP) {
    player.notify(`[Dungeon Code] 💥 Damage received`, `
<p>💢 <strong>${user.fullName || user.login}, you took <span style="color: crimson;"><strong>${damage}</strong></span> damage!</strong></p>
<p>📌 Reason: Overdue issue <a href="${issue.url}"><code>${issue.id}</code></a></p>
<p>❤️ Your current HP: <strong>${currentHP}</strong></p>
<hr />
<p><em>Stay on track to avoid further damage!</em></p>`);
}

function notifyDeathToPlayer(player, user) {
    player.notify(`[Dungeon Code] ☠️ You have died`, `
<p>💀 <strong>${user.fullName || user.login}, you have fallen in battle!</strong></p>
<p>🩸 Your HP dropped to <strong>0</strong> due to an <em>overdue task</em>.</p>
<p>⚰️ Your status is now: <strong style="color: darkred;">DEAD</strong></p>
<hr />
<p>🔁 Contact your team lead for resurrection... or accept your fate!</p>`);
}

function notifyDeathToLeader(leader, user, issue, playerCard) {
    leader.notify(`[Dungeon Code] ☠️ ${user.fullName || user.login} has died`, `
<p>⚠️ <strong>${user.fullName || user.login} has died in the dungeon!</strong></p>
<p>📌 The player’s HP reached <strong>0</strong> due to an overdue issue: <a href="${issue.url}"><code>${issue.id}</code></a></p>
<p>🔎 Player card: <a href="${playerCard.url}"><code>${playerCard.id}</code></a></p>
<p>📉 Status automatically changed to <strong style="color: darkred;">DEAD</strong></p>
<hr />
<p>🧙 Consider initiating a resurrection or assigning consequences accordingly.</p>`);
}