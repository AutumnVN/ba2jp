const { existsSync, readFileSync, writeFileSync } = require('fs');
const { EQUIPMENT, ITEM } = require('./constant.js');
const Account_LoginSync = require('./Account_LoginSync.json');
const Item_List = require('./Item_List.json');

let output = {
    exportVersion: 2,

    characters: [],
    owned_materials: {},

    character_order: [],
    disabled_characters: [],
    groups: {},
    language: "EN",
    level_cap: 90,
    server: "Global",
    site_version: "1.4.15",
};

let input;

if (existsSync('input.json')) {
    input = JSON.parse(readFileSync('input.json'));

    output = {
        ...output,
        ...{
            character_order: input.character_order,
            disabled_characters: input.disabled_characters,
            groups: input.groups,
            language: input.language,
            level_cap: input.level_cap,
            server: input.server,
            site_version: input.site_version,
        }
    };
}

Account_LoginSync.CharacterListResponse.CharacterDBs.forEach(c => {
    const weapon = Account_LoginSync.CharacterListResponse.WeaponDBs.find(w => w.UniqueId == c.UniqueId) || {};

    const gear = id => Account_LoginSync.EquipmentItemListResponse.EquipmentDBs.find(e => e.ServerId == id)?.Tier || 0;

    const characterData = {
        id: c.UniqueId,
        current: {
            level: c.Level,
            ue_level: weapon.Level || 0,
            bond: c.FavorRank,
            ex: c.ExSkillLevel,
            basic: c.PublicSkillLevel,
            passive: c.PassiveSkillLevel,
            sub: c.ExtraPassiveSkillLevel,
            gear1: gear(c.EquipmentServerIds[0]),
            gear2: gear(c.EquipmentServerIds[1]),
            gear3: gear(c.EquipmentServerIds[2]),
            star: c.StarGrade,
            ue: weapon.StarGrade || 0,
        },
        eleph: {
            owned: 0,
            unlocked: true,
            cost: 1,
            purchasable: 20,
            farm_nodes: 0,
            node_refresh: false,
            use_eligma: false,
            use_shop: false,
        }
    }

    const inputCharacterData = input?.characters?.find(ic => ic.id == c.UniqueId) || {};

    const res = {
        ...inputCharacterData,
        ...characterData,
    };

    res.target = inputCharacterData?.target || res.current;

    output.characters.push(res);
});

Account_LoginSync.EquipmentItemListResponse.EquipmentDBs.forEach(e => {
    if (e.BoundCharacterServerId) return;

    output.owned_materials[EQUIPMENT[e.UniqueId]] = e.StackCount;
});

Item_List.ItemDBs.forEach(i => {
    const id = i.UniqueId;

    if (id < 10) return;
    if (id > 13 && id < 100) return;
    if (id > 4999 && id < 9999) return;
    if (id > 9999) return;

    output.owned_materials[ITEM[id] || id] = i.StackCount;
});

output.owned_materials.Credit = Account_LoginSync.AccountCurrencySyncResponse.AccountCurrencyDB.CurrencyDict.Gold;

writeFileSync('output.json', JSON.stringify(output, null, 4));
