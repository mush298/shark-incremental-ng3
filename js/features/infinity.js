let INFINITY = {
     gain(i) {
        i = E(i).scaleAll('infinity')
        return E(9).mul(E(i).tetrate(2)).mul(1e15).pow10().pow10()
    },

    bulk(x) {
        x = E(x)
        if (x.lt('ee9e15')) return E(0)
        if (x.eq('ee9e15')) return E(1)
        if (x.eq(INFINITY.gain(6))) return E(6)
        if (x.eq(INFINITY.gain(8))) return E(8)
        if (x.eq(INFINITY.gain(10))) return E(10)
        return x.log10().log10().div(9e15).linear_sroot(2).scaleAll('infinity', true).floor()
    },

    ordinal_cost(x) {
        x = E(x)

        return E('1e18').mul(E(5).pow(x)).pow10().pow10()
    },

    power_formula(x) {
        x = E(x)

        return E(1).add(x.max(1).log10().pow(0.75)).pow(hasInfinityUpgrade(10) ? 1.25 : 1).mul(hasCE(1) ? CORRUPTION.effects[1].effect(0) : 1)
    }
}


let INFINITY_UPGRADES = [
    {
        cost: E(1),
        req: E(1),
        effect: (i) => {
         return E(2).pow(player.inf.infinities)
        }
    },
    {
        cost: E(10),
        req: E(1),
        effect: (i) => {
         return E('ee9e15')
        }
    },
    {
        cost: E(2500),
        req: E(3),
        effect: (i) => {
         return E('ee9e15')
        }
    },
    {
        cost: E(10000),
        req: E(3),
        effect: (i) => {
         return E('ee500e15')
        }
    },
    {
        cost: E(100000),
        req: E(4),
        effect: (i) => {
         return E(player.inf.infinities)
        }
    },
    {
        cost: E(1000000),
        req: E(4),
        effect: (i) => {
         return E(player.inf.infinities).pow(0.25)
        }
    },
    {
        cost: E(2.5e8),
        req: E(6),
        effect: (i) => {
         return E(player.inf.infinities).pow(0.25)
        }
    },
    {
        cost: E(2.5e9),
        req: E(6),
        effect: (i) => {
         return E(player.inf.infinities)
        }
    },
    {
        cost: E(5e10),
        req: E(7),
        effect: (i) => {
         return E(player.inf.infinities)
        }
    },
    {
        cost: E(1e12),
        req: E(8),
        effect: (i) => {
         return E(player.inf.infinities).root(2.5)
        }
    },
    {
        cost: E(1e14),
        req: E(9),
        effect: (i) => {
         return E(1.1)
        }
    },
    {
        cost: E(5e14),
        req: E(10),
        effect: (i) => {
         return E(1.1)
        }
    },
]
function hasInfinityUpgrade(i) {
    return player.inf.upgrades.includes(i)
}
function buyInfinityUpgrade(i) {
    if (player.inf.points.gte(INFINITY_UPGRADES[i].cost) && (player.inf.infinities.gte(INFINITY_UPGRADES[i].req)) && !(player.inf.upgrades.includes(i))) {
       player.inf.upgrades.push(i)
    }
}

function infUpgradeEffect(i) {
    return INFINITY_UPGRADES[i].effect(123)
}

function updateInfinityHTML() {
    let iu = lang_text('infinity-upgrades')
for (let i = 0; i < INFINITY_UPGRADES.length; i++) {
 el(`iu${i}`).innerHTML = iu[i](infUpgradeEffect(i), INFINITY_UPGRADES[i].cost)
 if (player.inf.upgrades.includes(i)) {
    el(`iu${i}`).classList.add('bought')
 } else {
    el(`iu${i}`).classList.remove('bought')
 }
 }





 // Infinity power

 let ordinals = lang_text('ordinals')

 el('infinity-power').innerHTML = lang_text('infinity-power', format(player.inf.power), formatGain(CURRENCIES.infinity_power.amount, CURRENCIES.infinity_power.gain), INFINITY.power_formula(player.inf.power))

 el('ordinal-generate').innerHTML = lang_text('ordinal-generate', `<b>${ordinals[player.inf.ordinal + 1]}</b>`, format(INFINITY.ordinal_cost(player.inf.ordinal + 1)))
 el('ordinal-generate').style.display = el_display(player.inf.ordinal < 23) // no beta we die like george
 for (let i = 0; i < 24; i++) {
    el(`ordinal${i}`).innerHTML = lang_text('ordinal-amount', `<b>${format(CURRENCIES[`ordinal${i}`].amount)}</b>`, formatGain(CURRENCIES[`ordinal${i}`].amount, CURRENCIES[`ordinal${i}`].gain), `<b>${ordinals[i]}</b>`, `<b>${ i - 1 >= 0 ? ordinals[i - 1] : toTextStyle('Infinity Power', 'infinity')}</b>`, formatMult(CURRENCIES[`ordinal${i}`].mult))
    el(`ordinal${i}`).style.display = el_display(player.inf.ordinal >= i)
}



el('corrupt-button').innerHTML =  !player.inf.corrupt ? lang_text('go-corrupt') : lang_text('leave-corrupt')

el('corrupted-fragments').innerHTML = lang_text('corrupted-fragments', format(CURRENCIES.corrupt.amount), formatGain(CURRENCIES.corrupt.amount, CURRENCIES.corrupt.gain), formatPow(tmp.corrupt_exponent))

el('corrupt-amount').innerHTML = lang_text('corrupt-amount', format(tmp.corrupt_start))

let ce = lang_text('cd-effects')

for (let i = 0; i < CORRUPTION.dims; i++) {
  
   el(`corrupted-dimension-${i}`).innerHTML = `
   
   <p>${lang_text('corrupted-dimension', i+1)}</p>

   <p>${ce[i](CORRUPTION.effects[i].effect(0))}</p>
   
   `
   el(`cd${i}`).style.display = el_display(CURRENCIES.corrupt.amount.gte(CORRUPTION.unlock[i]))
}

}

function setupInfinityHTML() {
    let h = ''
    let iu = lang_text('infinity-upgrades')
    for (let i = 0; i < INFINITY_UPGRADES.length; i++) {
       h += `<button class = "infinity-upgrade" id = "iu${i}" onclick = "buyInfinityUpgrade(${i})"></button>`
    }

    el('corruption-summary').innerHTML = lang_text('corruption-summary')
    el('corrupt-button').innerHTML = lang_text('go-corrupt')
    el('infinity-upgrades').innerHTML = h


    let j = ''
   
    for (let i = 0; i < 24; i++) {
       j += `<div id = "ordinal${i}"></div>`
    }
    el('ordinals').innerHTML = j

    let k = '' 

    for (let i = 0; i < CORRUPTION.dims; i++) {
        k += `  
    <button class = "inf corrupted-dimension" id = "cd${i}">
                
    <div id = "corrupted-dimension-${i}">
     
       <p>Corrupted Dimension ${i+1}</p>

       <p>x208.84 corrupted fragments</p>

    </div>

    </button>`
     }

     el("corrupted-dimensions").innerHTML = k

  
}

function upgradeOrdinal() {
    if (player.fish.gte(INFINITY.ordinal_cost(player.inf.ordinal + 1))) {
        player.inf.ordinal++;
    }
}


let CORRUPTION = {

    dims: 8, //because YES

experiment() {
    player.inf.corrupt = !player.inf.corrupt


    doReset('sacrifice', true)

},

limit() {
    let x = tmp.corrupt_exponent

    return expPow(E('ee1e26'), x)
},

effects: [
    {
        effect: (y) => {
        let x = CURRENCIES.corrupt.amount.max(10).log10().pow(2).add(1)
        
        if (hasCE(2)) x = x.pow(CORRUPTION.effects[2].effect(0))

        return x
        }
    },
    {
        effect: (y) => {
        let x = CURRENCIES.corrupt.amount.max(10).log10()

        if (hasCE(7)) x = x.mul(CORRUPTION.effects[7].effect(0))

        return x
        }
    },
    {
        effect: (y) => {
        let x = CURRENCIES.corrupt.amount.max(10).log10().root(2.5)

        if (hasCE(4)) x = x.mul(CORRUPTION.effects[4].effect(0))

        return x
        }
    },
    {
        effect: (y) => {
        let x = CURRENCIES.corrupt.amount.max(10).root(10).div(4)

        
        if (hasCE(6)) x = x.mul(CORRUPTION.effects[6].effect(0))

        return x
        }
    },
    {
        effect: (x) => {
        return CURRENCIES.corrupt.amount.max(10).log10().root(5).overflow(2, 0.5)
        }
    },
    {
        effect: (x) => {
        return CURRENCIES.corrupt.amount.max(10).log10().pow(2.5)
        }
    },
    {
        effect: (x) => {
        return CURRENCIES.corrupt.amount.max(10).log10()
        }
    },
    {
        effect: (x) => {
        return CURRENCIES.corrupt.amount.max(10).log10().root(2.5)
        }
    },
],

unlock: [100,1000,10000,'1e7','1e11','1e28','1e32','1e35',E('F1.6e308')]

}

let hasCE = i => CURRENCIES.corrupt.amount.gte(CORRUPTION.unlock[i])











// corrupted assembler (yeah)

let SYMBOLS = ['Og',`∞`,]

const CORRUPTED_ASSEMBLER = [
    {
        color: ['#960ABD','#000000'],

        get res_text() { return CURRENCIES['dark-matter'].costName },
        get base() { return CURRENCIES['dark-matter'].amount },

        temperature(x) {
            var y = this.base.max(0).add(1).log10().log10().mul(x)
            return y
        },
    },
    {
        color: ['#FECC02','#DBB64B'],

        get res_text() { return CURRENCIES.infinity.costName },
        get base() { return CURRENCIES.infinity.amount },

        temperature(x) {
            var y = this.base.max(0).add(1).log10().mul(x)
            return y
        },
    },
]

var cra_builder = -1

function moveCRADirection(before,d) {
    switch (d) {
        case 0:
            return (before+12)%16
        case 1:
            return (before+4)%16
        case 2:
            return Math.floor(before/4)*4+(before%4+3)%4
        case 3:
            return Math.floor(before/4)*4+(before%4+1)%4
    }
}

function setupCorruptedAssemblerHTML() {
    var h = ""

    for (let x = 0; x < 16; x++) {
        /**
        var ii = Math.floor(Math.random()*4)
        var r = CORE_REACTOR[ii], a = CORE_ASSEMBLER[ii]
        h += `<button class='ca-grid-btn active' id="ca-grid-${x}" style="--color1: ${a.color[0]}; --color2: ${a.color[1]};">
            <div>${r.symbol}</div>
            100%
        </button>`
        **/
        h += `<button class='cra-grid-btn' id="cra-grid-${x}-div" onclick="placeCRABuildling(${x})"></button>`
    }

    el("corrupted-assembler-grid").innerHTML = h, h = ''

    for (let x = 0; x < 16; x++) el(`cra-grid-${x}-div`).addEventListener('contextmenu', e => {
        e.preventDefault()
        placeCRABuildling(x,-1)
    });

    for (let i = 0; i < CORRUPTED_ASSEMBLER.length; i++) {
         a = CORRUPTED_ASSEMBLER[i]

        h += `<button class="cra-building" id="cra-building-${i}-div" onclick="chooseCRABuilding(${i})">
        <div class="table-center"><div>${lang_text(`corrupted-${i}-name`)}</div><div class="cra-building-symbol" style="--color1: ${a.color[0]}; --color2: ${a.color[1]};"></div></div>
        <div id="cra-building-${i}-desc">???</div>
        </button>`
    }

    el("corrupted-assembler-buildings").innerHTML = h, h = ""
}

function chooseCRABuilding(i) {
    cra_builder = cra_builder == i ? -1 : i
}

const CRA_MAX_BUILDINGS_COST = ['1e24','1e26',E('ee376')]

function purchaseCRAMaxBuildings() {
    if (CURRENCIES.infinity.amount.gte(CRA_MAX_BUILDINGS_COST[player.inf.max_buildings]??EINF)) {
        player.inf.max_buildings++
    }
}

function placeCRABuildling(i,b=cra_builder) {
    if (b == -1 || (player.inf.assembler[i] >= 0 || tmp.totalCRABuildings < player.inf.max_buildings) && tmp.placedCRABuildings[b] < tmp.maxCRABuildingEach) {
        player.inf.assembler[i] = b

        updateCorruptedAssemblerTemp()
    }
}

function getCorruptionXp() {
    var total_temp = E(1)
   

    for (let i = 0; i < CORRUPTED_ASSEMBLER.length; i++) {
        var r = CORE_REACTOR[i], a = CORRUPTED_ASSEMBLER[i]

        var ss = player.inf.assembler_strength[i], s = tmp.cra_building_strength[i]

        total_temp = total_temp.add(a.temperature(s))
    }

    return total_temp
}

function updateCorruptedAssemblerHTML() {
    var req = CRA_MAX_BUILDINGS_COST[player.inf.max_buildings]??EINF
    el('cra-building-limit').innerHTML = lang_text('corrupted-assembler-building-limit',player.inf.max_buildings,req,tmp.totalCRABuildings)
    el('cra-building-limit').className = el_classes({locked: CURRENCIES.infinity.amount.lt(req), 'huge-btn': true})

    el('corrupted-assembler-erase').innerHTML = lang_text('core-assembler-erase')

    var icons = [icon("up-arrow"), icon("down-arrow")]
    var total_temp = E(1)
   

    for (let i = 0; i < CORRUPTED_ASSEMBLER.length; i++) {
        var r = CORE_REACTOR[i], a = CORRUPTED_ASSEMBLER[i]

        var ss = player.inf.assembler_strength[i], s = tmp.cra_building_strength[i]

        // el(`ca-building-${i}-div`).className = el_classes({'ca-building': true, locked: tmp.placedACBuildings[i]>=1 || tmp.totalCABuildings>=player.core.max_buildings})

        el(`cra-building-${i}-desc`).innerHTML = lang_text('corrupted-assembler-building-stats',compareStyle(formatPercent(s,0),s,ss),tmp.placedCRABuildings[i],tmp.maxCRABuildingEach) + "<br>"
        + lang_text(`cra-building-base`,a.res_text) + "<br>"
        + lang_text(`cra-building-temp`,compareStyle(format(a.temperature(s)),s,ss)) // + " " + lang_text(`core-${i}-assemble`)

        total_temp = total_temp.add(a.temperature(s))
    }

    if (cra_builder >= 0) {
        var a = CORRUPTED_ASSEMBLER[cra_builder]
        el('corrupted-assembler-choose-div').innerHTML = "<div>"+lang_text('core-assembler-choose')+": "+lang_text(`corrupted-${cra_builder}-name`).bold()+`</div><div class="cra-building-symbol" style="--color1: ${a.color[0]}; --color2: ${a.color[1]};"></div>`
    } else el('corrupted-assembler-choose-div').innerHTML = lang_text('core-assembler-erase')

    for (let x = 0; x < 16; x++) {
        var b = player.inf.assembler[x], b_el = el(`cra-grid-${x}-div`)

        b_el.className = el_classes({'cra-grid-btn': true, active:b>=0})

        if (b>=0) {
            let a = CORRUPTED_ASSEMBLER[b]

            b_el.style.setProperty("--color1", a.color[0])
            b_el.style.setProperty("--color2", a.color[1])

            b_el.innerHTML = `<div>${SYMBOLS[b]}</div>`+formatPercent(tmp.crb_strengths[x],0)
        } else {
            b_el.innerHTML = ""
        }
    }

    el("corruption-xp-after").innerHTML = lang_text('corruption-xp', compareStyle(format(total_temp),total_temp,tmp.corruption_xp))
    
}

function updateCorruptedAssemblerTemp() {

    tmp.corruption_xp = E(2)

    


    
    tmp.totalCRABuildings = player.inf.assembler.filter(b => b>=0).length

    tmp.maxCRABuildingEach = Math.min(2,1 + Math.floor(player.inf.max_buildings/4))+Math.ceil(Math.max(player.inf.max_buildings-8,0)/4)

    tmp.placedCRABuildings = [0,0,0,0]
    tmp.cra_building_strength = [0,0,0,0]
    tmp.crb_strengths = []

    var assembler = player.inf.assembler

    for (let x = 0; x < 16; x++) {
        var b = assembler[x]
        if (b>=0) {
            var s = 1
            for (let y = 0; y < 4; y++) {
                var bb = assembler[moveCADirection(x,y)]
                let add = 0.5
                if (bb>=0) s += add
            }
            tmp.cra_building_strength[b]+=s
            tmp.crb_strengths[x]=s
            tmp.placedCRABuildings[b]++
        }
    }
}


const checkOccurrence = (array, element) => {
    let counter = 0;
    for (item of array.flat()) {
        if (item == element) {
            counter++;
        }
    };
    tmp.total_adders = counter
};
