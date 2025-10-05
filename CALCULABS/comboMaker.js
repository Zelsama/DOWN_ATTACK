import skills from './data/tamerSkills.json' with { type: 'json' };
function comboMaker(spec = "Awakening", skillsPriority=[], addCritHate = 0, time = 20){
    let newSkills = skills.filter(s => s.spec === spec || s.spec === "both")
    let combo = []
    let totalTime = 0
    let totalDamage = 0
    let cooldownSkills = []
    let priorityList = []

    function updateCooldown(time, skill){
        if(cooldownSkills.map(cd => cd.id).includes(skill)){
            for (let cd in cooldownSkills){
                if(cooldownSkills[cd].id === skill){
                    cooldownSkills[cd].avaliableIn = totalTime + time
                }
            }
        }else{
            cooldownSkills.push({id: skill, avaliableIn: totalTime + time})
        }
    }

    for (let skill in newSkills){
        let dps = (newSkills[skill].totalDamage / newSkills[skill].animation) * (1 + (addCritHate + newSkills[skill].crit_hate >= 1 ? 1 : addCritHate + newSkills[skill].crit_hate))
        let dmg = newSkills[skill].totalDamage * (1 + (addCritHate + newSkills[skill].crit_hate >= 1 ? 1 : addCritHate + newSkills[skill].crit_hate))
        if(newSkills[skill].spammable === true){
            dmg = (newSkills[skill].totalDamage * (1 + (addCritHate >= 1 ? 1 : addCritHate)))
            dps = (newSkills[skill].totalDamage / newSkills[skill].animation) * (1 + (addCritHate >= 1 ? 1 : addCritHate))
            priorityList.push({"id":newSkills[skill].id + "spam_version",  "dps": dps*0.4, "dmg": dmg*0.4})
        }
        priorityList.push({"id":newSkills[skill].id, "dps": dps, "dmg": dmg})
    }
    priorityList.sort((a, b) => b.dps - a.dps)
    console.log(priorityList)

    if(skillsPriority.length > 0){
        for(let skill in skillsPriority){
        combo.push(skillsPriority[skill])
        let currentSkill = newSkills.find(s => s.id === skillsPriority[skill])
        let crit_hate = (currentSkill.crit_hate) + addCritHate 
        if(crit_hate > 1) crit_hate = 1
        totalDamage += (currentSkill.totalDamage) * ((1 + crit_hate)*2)
        totalTime += currentSkill.animation
        let dps = (currentSkill.totalDamage / currentSkill.animation) * ((1 + crit_hate)*2)
        let dmg = (currentSkill.totalDamage) * (1 + crit_hate)
        priorityList.unshift({"id": skillsPriority[skill], "dps": dps, "dmg": dmg})
        updateCooldown(currentSkill.cooldown, currentSkill.id)
        if(totalTime >= time) return {combo, totalDamage, totalTime}
        }          
    }    

    while(totalTime < time){
        let count = 0
        while(count < priorityList.length){
            let skillCooldown = false
            if(cooldownSkills.map(cd => cd.id).includes(priorityList[count].id) && cooldownSkills.find(cd => cd.id === priorityList[count].id).avaliableIn > totalTime){
                skillCooldown = true
            }
            if(!skillCooldown){
                let currentSkill = newSkills.find(s => s.id === priorityList[count].id)
                if(!currentSkill) currentSkill = newSkills.find(s => s.id === priorityList[count].id.replace("spam_version", ""))
                
                updateCooldown(currentSkill.cooldown, currentSkill.id)
                totalDamage += priorityList[count].dmg
                totalTime += currentSkill.animation
                combo.push(priorityList[count].id)
                count = 0
                if (totalTime > time) break
            }else{
                count++
            }
        }
    }


    return {combo, totalDamage, totalTime}
}
let x = comboMaker()
console.log(x)