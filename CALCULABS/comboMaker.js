import skills from './data/tamerSkills.json' with { type: 'json' };

function comboMaker(spec = "Awakening", skillsPriority = [], addCritHate = 0, time = 20) {
    const newSkills = skills.filter(s => s.spec === spec || s.spec === "both");
    const skillMap = Object.fromEntries(newSkills.map(skill => [skill.id, skill]));

    const combo = [];
    let totalTime = 0;
    let totalDamage = 0;
    const cooldownSkills = [];
    const priorityList = [];

    function updateCooldown(duration, skillId) {
        const existing = cooldownSkills.find(cd => cd.id === skillId);
        if (existing) {
            existing.avaliableIn = totalTime + duration;
        } else {
            cooldownSkills.push({ id: skillId, avaliableIn: totalTime + duration });
        }
    }

    for (const skill of newSkills) {
        const critFactor = addCritHate + skill.crit_hate >= 1 ? 1 : addCritHate + skill.crit_hate;
        let dps = (skill.totalDamage / skill.animation) * (1 + critFactor);
        let dmg = skill.totalDamage * (1 + critFactor);

        priorityList.push({ id: skill.id, baseId: skill.id, dps, dmg });

        if (skill.spammable === true) {
            const spamCritFactor = addCritHate >= 1 ? 1 : addCritHate;
            const spamDps = (skill.totalDamage / skill.animation) * (1 + spamCritFactor) * 0.4;
            const spamDmg = skill.totalDamage * (1 + spamCritFactor) * 0.4;

            priorityList.push({
                id: `${skill.id}spam_version`,
                baseId: skill.id,
                dps: spamDps,
                dmg: spamDmg
            });
        }
    }

    priorityList.sort((a, b) => b.dps - a.dps);

    if (skillsPriority.length > 0) {
        for (const skillId of skillsPriority) {
            const currentSkill = skillMap[skillId];
            if (!currentSkill) continue;

            const entry = {
                id: skillId,
                baseId: currentSkill.id
            };

            let crit_hate = currentSkill.crit_hate + addCritHate;
            if (crit_hate > 1) crit_hate = 1;

            totalDamage += currentSkill.totalDamage * ((1 + crit_hate) * 2);
            totalTime += currentSkill.animation;

            const dps = (currentSkill.totalDamage / currentSkill.animation) * ((1 + crit_hate) * 2);
            const dmg = currentSkill.totalDamage * (1 + crit_hate);

            priorityList.unshift({ id: skillId, baseId: currentSkill.id, dps, dmg });
            combo.push(entry);
            updateCooldown(currentSkill.cooldown, currentSkill.id);

            if (totalTime >= time) {
                return {
                    combo: combo.map(e => e.id),
                    totalDamage,
                    totalTime
                };
            }
        }
    }

    while (totalTime < time) {
        let count = 0;

        while (count < priorityList.length) {
            const entry = priorityList[count];
            const currentSkill = skillMap[entry.baseId];

            if (!currentSkill) {
                count++;
                continue;
            }

            const previousEntry = combo.at(-1);
            const previousBaseId = previousEntry ? previousEntry.baseId : null;

            if (currentSkill.requires) {
                if (!previousBaseId || !currentSkill.requires.includes(previousBaseId)) {
                    count++;
                    continue;
                }
            }

            const cooldownEntry = cooldownSkills.find(cd => cd.id === entry.baseId);
            if (cooldownEntry && cooldownEntry.avaliableIn > totalTime) {
                count++;
                continue;
            }

            updateCooldown(currentSkill.cooldown, entry.baseId);
            totalDamage += entry.dmg;
            totalTime += currentSkill.animation;
            combo.push({ id: entry.id, baseId: entry.baseId });
            count = 0;

            if (totalTime > time) break;
        }

        if (count >= priorityList.length) break;
    }

    return {
        combo: combo.map(e => e.id),
        totalDamage,
        totalTime
    };
}

const x = comboMaker();
console.log(x);