var tmp = {}
var options = {
    notation: "mixed_sc",
    max_range: 9,
    pass: 0,
}

function reloadTemp() {
    tmp = {
        currency_gain: {},

        shark_bonus: {},
        shark_upg_eff: [],

        shark_elo: E(0),
        shark_rank_bonus: {},

        research_eff: {},

        su_el: {},
        su_locked: {},
        su_automated: [],

        depth_gain: [],
        explore_mult: [],
        explore_eff: [],
        explore_upg_boost: [],
        explore_mil_reached: [],

        core_bonus_level: [],
        core_effect: [],
        cr_boost: [],

        ca_building_effect: [],
        ca_building_strength: [],

        evolution_tree_effect: [],
        charged_et_effect: [],

        mining_fortune: E(0),
        ore_spawn_base: 1,
        ore_generator: 0,
        mining_speed: E(1),
        mining_damage: E(1),

        mining_tier_bonus: [],

        forge_speed: E(1),
        forge_affords: {},
        forge_effect: {},

        shark_op: E(1),
        shark_op_start: E('ee40'),

        particle_accel_eff: [],

        scalings: {},

        bh_pause: false,

        bh_reduction: E(1),
        remnant_upg_effects: [],

        ss_difficulty: 0,
        sb_upg_effects: {},
        experiment_boosts: [],

        constellation_boosts: [],

        infinity_gain: E(0),
        corrupt_start: E('ee1e26'),
        corrupt_exponent: E(0),

        corruption_xp: E(0)
    }

    for (let x in EXPLORE) {
        tmp.explore_mil_reached[x] = []
        tmp.explore_upg_boost[x] = [E(1),E(1)]
    }

    for (let x in SCALINGS) {
        tmp.scalings[x] = []
        for (let y in SCALINGS[x].base) {
            let b = []
            for (let z of SCALINGS[x].base[y]) b.push(z)
            tmp.scalings[x].push(b)
        }
    }
}

function updateTemp() {
    tmp.ss_difficulty = SOLAR_SYSTEM[player.solar_system.active]?.difficulty ?? 0 
    tmp.cr_active = player.core.radiation.active

    tmp.corrupt_start = CORRUPTION.limit()

    let x = CURRENCIES.corrupt.amount.max(10).log10().pow(2) //yeah
        
    if (hasCE(2)) x = x.pow(CORRUPTION.effects[2].effect(0))

    player.inf.corrupted_fragments = player.inf.corrupted_fragments.min('1e36')
    // player.inf.power = player.inf.power.min('e9e12')

    tmp.corrupt_exponent = x

    updateResearchTemp()
    updateScalingsTemp()
    updateConstellationTemp()
    updateSingularityTemp()
    updatePATemp()
    updateEvolutionTreeTemp()
    updateCoreTemp()
    updateExplorationTemp()
    updateSharkTemp()
    updateCorruptedAssemblerTemp()

    var asu = []
    for (let [i,v] of Object.entries(AUTOMATION)) if ('su' in v && isAutoEnabled(i)) asu.push(...v.su)
    tmp.su_automated = asu

    for (let [i,v] of Object.entries(CURRENCIES)) tmp.currency_gain[i] = preventNaNDecimal(v.gain??E(0))

    tmp.infinity_gain = INFINITY.bulk(player.fish).sub(player.inf.infinities)

    reloadOres()
}

function updateOptions() {
    options.notation = ['sc','st','mixed_sc','log'][player.radios["notation"]]
    options.max_range = [3,6,9,12,15,18,21][player.radios["comma-format"]]
}
