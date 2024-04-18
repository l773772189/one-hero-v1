export class Boss4 {
    constructor() {
        const cdotaBaseNPC1 = CreateUnitByName('npc_dota_neutral_black_dragon', Vector(-1984, -649, 256), true, null, null, DotaTeam.BADGUYS);
        cdotaBaseNPC1.SetForwardVector(Vector(1, -1, 0));
        cdotaBaseNPC1.SetBaseMaxHealth(5000);
        cdotaBaseNPC1.SetBaseDamageMin(150);
        cdotaBaseNPC1.SetBaseDamageMax(200);
        cdotaBaseNPC1.SetPhysicalArmorBaseValue(10);
        const cdotaBaseNPC2 = CreateUnitByName('npc_dota_neutral_granite_golem', Vector(1500, -706, 0), true, null, null, DotaTeam.BADGUYS);
        cdotaBaseNPC2.SetForwardVector(Vector(0, -1, 0));
        cdotaBaseNPC2.SetBaseMaxHealth(5000);
        cdotaBaseNPC2.SetBaseDamageMin(150);
        cdotaBaseNPC2.SetBaseDamageMax(200);
        cdotaBaseNPC2.SetPhysicalArmorBaseValue(10);
        const cdotaBaseNPC3 = CreateUnitByName('npc_dota_neutral_prowler_acolyte', Vector(-916, 982, 128), true, null, null, DotaTeam.BADGUYS);
        cdotaBaseNPC3.SetForwardVector(Vector(0, -1, 0));
        cdotaBaseNPC3.SetBaseMaxHealth(5000);
        cdotaBaseNPC3.SetBaseDamageMin(150);
        cdotaBaseNPC3.SetBaseDamageMax(200);
        cdotaBaseNPC3.SetPhysicalArmorBaseValue(10);
        cdotaBaseNPC3.SetForwardVector(Vector(1, -1, 0));
        const cdotaBaseNPC4 = CreateUnitByName('npc_dota_neutral_big_thunder_lizard', Vector(1366, 1521, 128), true, null, null, DotaTeam.BADGUYS);
        cdotaBaseNPC4.SetForwardVector(Vector(-1, -1, 0));
        cdotaBaseNPC4.SetBaseMaxHealth(5000);
        cdotaBaseNPC4.SetBaseDamageMin(150);
        cdotaBaseNPC4.SetBaseDamageMax(200);
        cdotaBaseNPC4.SetPhysicalArmorBaseValue(10);

        ListenToGameEvent(
            'entity_killed',
            event => {
                const killedUnit = EntIndexToHScript(event.entindex_killed) as CDOTA_BaseNPC;
                const unit = EntIndexToHScript(event.entindex_attacker) as CDOTA_BaseNPC;
                const player = unit.GetPlayerOwner();
                if (
                    killedUnit.GetUnitName().includes('npc_dota_neutral_black_dragon') ||
                    killedUnit.GetUnitName().includes('npc_dota_neutral_granite_golem') ||
                    killedUnit.GetUnitName().includes('npc_dota_neutral_prowler_acolyte') ||
                    killedUnit.GetUnitName().includes('npc_dota_neutral_big_thunder_lizard')
                ) {
                    const equipmentIndex = Math.floor(Math.random() * equipmentPool.length);
                    const equipmentName = equipmentPool[equipmentIndex];
                    // 在死亡位置创建装备
                    CreateItemOnPositionSync(killedUnit.GetAbsOrigin(), CreateItem(equipmentName, player, player));
                    print(`名称${killedUnit.GetUnitName()}`);
                    const name = killedUnit.GetUnitName();
                    Timers.CreateTimer(10, () => {
                        const v = null;
                        if (name.includes('npc_dota_neutral_black_dragon')) {
                            const unit = CreateUnitByName(name, Vector(-1984, -649, 256), true, null, null, DotaTeam.BADGUYS);
                            unit.SetForwardVector(Vector(1, -1, 0));
                            unit.SetBaseMaxHealth(20000);
                            unit.SetBaseDamageMin(1500);
                            unit.SetBaseDamageMax(1500);
                            unit.SetPhysicalArmorBaseValue(10);
                        }
                        if (name.includes('npc_dota_neutral_granite_golem')) {
                            const cdotaBaseNPC2 = CreateUnitByName(
                                'npc_dota_neutral_granite_golem',
                                Vector(1500, -706, 0),
                                true,
                                null,
                                null,
                                DotaTeam.BADGUYS
                            );
                            cdotaBaseNPC2.SetForwardVector(Vector(0, -1, 0));
                            cdotaBaseNPC2.SetBaseMaxHealth(20000);
                            cdotaBaseNPC2.SetBaseDamageMin(1500);
                            cdotaBaseNPC2.SetBaseDamageMax(1500);
                            cdotaBaseNPC2.SetPhysicalArmorBaseValue(10);
                        }
                        if (name.includes('npc_dota_neutral_prowler_acolyte')) {
                            const cdotaBaseNPC3 = CreateUnitByName(
                                'npc_dota_neutral_prowler_acolyte',
                                Vector(-916, 982, 128),
                                true,
                                null,
                                null,
                                DotaTeam.BADGUYS
                            );
                            cdotaBaseNPC3.SetForwardVector(Vector(0, -1, 0));
                            cdotaBaseNPC3.SetBaseMaxHealth(20000);
                            cdotaBaseNPC3.SetBaseDamageMin(1500);
                            cdotaBaseNPC3.SetBaseDamageMax(1500);
                            cdotaBaseNPC3.SetPhysicalArmorBaseValue(10);
                            cdotaBaseNPC3.SetForwardVector(Vector(1, -1, 0));
                        }
                        if (name.includes('npc_dota_neutral_big_thunder_lizard')) {
                            const cdotaBaseNPC4 = CreateUnitByName(
                                'npc_dota_neutral_big_thunder_lizard',
                                Vector(1366, 1521, 128),
                                true,
                                null,
                                null,
                                DotaTeam.BADGUYS
                            );
                            cdotaBaseNPC4.SetForwardVector(Vector(-1, -1, 0));
                            cdotaBaseNPC4.SetBaseMaxHealth(20000);
                            cdotaBaseNPC4.SetBaseDamageMin(1500);
                            cdotaBaseNPC4.SetBaseDamageMax(1500);
                            cdotaBaseNPC4.SetPhysicalArmorBaseValue(10);
                        }
                        const unit = CreateUnitByName(name, v, true, null, null, DotaTeam.BADGUYS);
                        unit.SetForwardVector(Vector(-1, -1, 0));
                        unit.SetBaseMaxHealth(20000);
                        unit.SetBaseDamageMin(1500);
                        unit.SetBaseDamageMax(1500);
                        unit.SetPhysicalArmorBaseValue(10);
                    });
                }
            },
            undefined
        );
    }
}
const equipmentPool: string[] = ['item_cly', 'item_mfj', 'item_zfbs'];
