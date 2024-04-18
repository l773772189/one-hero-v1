export class Box {
    equipmentPool: string[] = [
        // 'item_jrdxj',
        // 'item_sllxc',
        // 'item_yd',
        // 'item_ldzd',
        // 'item_kzsmfwdsc',
        // 'item_hbssh',
        // 'item_yzjj',
        // 'item_hyhsf',
        // 'item_lgcr',
        // 'item_dyhj',
        // 'item_hlbd',
        // 'item_mgzh',
        // 'item_fzhj',
        // 'item_fzwz',
        // 'item_pyzj',
        // 'item_fyshj',
        // 'item_jfzx',
        // 'item_sdst',
        // 'item_szx',
        // 'item_clxl',
        // 'item_shts',
        // 'item_hykj',
        // 'item_ylxqj',
        // 'item_spyd',
        // 'item_smzj',
        // 'item_yyzj',
        // 'item_hlzj',
        // 'item_mfgz',
        // 'item_mlq',
        // 'item_mlhf',
        // 'item_fss',
        // 'item_fjshs',
        // 'item_zhjz',
        // 'item_tdmfs',
        // 'item_hymfs',
        // 'item_tfmfs',
        // 'item_hbmfs',
        // 'item_ldmfs',
        // 'item_hazx',
    ];

    constructor() {
        //随机生成50个箱子
        for (let i = 0; i < 50; i++) {
            this.genBox();
        }
        //每当箱子被砍掉，随机生成一个
        ListenToGameEvent(
            'entity_killed',
            event => {
                const killedUnit = EntIndexToHScript(event.entindex_killed) as CDOTA_BaseNPC;
                const unit = EntIndexToHScript(event.entindex_attacker) as CDOTA_BaseNPC;
                const controller = unit.GetPlayerOwner();
                if (killedUnit.GetUnitName().includes('box')) {
                    this.genBox();
                    this.genItem(killedUnit.GetAbsOrigin(), controller);
                }
            },
            undefined
        );
    }

    genBox(): Vector {
        const x = RandomInt(-7000, 7000);
        const y = RandomInt(-7000, 7000);
        const z = 0;
        CreateUnitByName('box1', Vector(x, y, z), true, null, null, DotaTeam.BADGUYS);
        return Vector(x, y, z);
    }

    genItem(v: Vector, controller: any) {
        print('掉落装备');
        const equipmentName = this.equipmentPool[RandomInt(0, this.equipmentPool.length)];
        print(equipmentName);
        const item = CreateItem(equipmentName, controller, controller);
        print(item.GetName());
        CreateItemOnPositionSync(v, item);
    }
}
