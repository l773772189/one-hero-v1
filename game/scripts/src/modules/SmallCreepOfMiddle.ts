export class SmallCreepOfMiddle {
    constructor() {
        const player = PlayerResource.GetPlayer(0);
        const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
        const vector = Vector(-1984, -649, 256);
        hero.SetForwardVector(vector);
        // CreateUnitByName('SmallCreepOfMiddle1', vector.__add(RandomVector(RandomInt(0, 300))), true, null, null, DotaTeam.BADGUYS);
        // CreateUnitByName('SmallCreepOfMiddle2', vector.__add(RandomVector(RandomInt(0, 300))), true, null, null, DotaTeam.BADGUYS);
        CreateUnitByName('SmallCreepOfMiddle3', vector.__add(RandomVector(RandomInt(0, 500))), true, null, null, DotaTeam.BADGUYS);
        CreateUnitByName('SmallCreepOfMiddle4', vector.__add(RandomVector(RandomInt(0, 500))), true, null, null, DotaTeam.BADGUYS);
        CreateUnitByName('SmallCreepOfMiddle5', vector.__add(RandomVector(RandomInt(0, 500))), true, null, null, DotaTeam.BADGUYS);
    }
}
