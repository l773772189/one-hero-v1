export class BoxTest {
    // 定义装备池数组
    equipmentPool1: string[] = [
        'item_yd',
        'item_hbssh',
        'item_lgcr',
        'item_mgzh',
        'item_pyzj',
        'item_sdst',
        'item_shts',
        'item_spyd',
        'item_smzj',
        'item_yyzj',
        'item_hlzj',
        'item_mfgz',
        'item_mlq',
        'item_mlhf',
        'item_fss',
    ];

    equipmentPool2: string[] = ['item_sllxc', 'item_kzsmfwdsc', 'item_hyhsf', 'item_hlbd', 'item_fzwz', 'item_jfzx', 'item_clxl', 'item_ylxqj'];

    equipmentPool3: string[] = ['item_jrdxj', 'item_ldzd', 'item_yzjj', 'item_dyhj', 'item_fzhj', 'item_fyshj', 'item_szx', 'item_hykj'];

    equipmentPool4: string[] = ['item_cly', 'item_mfj', 'item_zfbs', 'item_tdmfs', 'item_hymfs', 'item_tfmfs', 'item_hbmfs', 'item_ldmfs'];
    constructor() {
        const player = PlayerResource.GetPlayer(0);
        const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
        const vector = hero.GetAbsOrigin();
        CreateUnitByName('boxTest', vector, true, null, null, DotaTeam.BADGUYS);
        ListenToGameEvent(
            'entity_killed',
            event => {
                const killed = EntIndexToHScript(event.entindex_killed) as CDOTA_BaseNPC;
                const attacker = EntIndexToHScript(event.entindex_attacker) as CDOTA_BaseNPC;
                const killedName = killed.GetUnitName();
                const getPlayerOwner = attacker.GetPlayerOwner();
                const deathLocation = killed.GetAbsOrigin();
                const addPercent = attacker.GetLevel();
                if (killed.GetUnitName().includes('custom_unit_box1')) {
                    //开箱
                    this.openBox(killed);
                    //创建新箱子
                    this.createNewBox(killed.GetUnitName());
                    //掉落装备
                    const item = CreateItem(this.equipmentPool1[RandomInt(0, this.equipmentPool1.length - 1)], getPlayerOwner, getPlayerOwner);
                    this.dropItem(deathLocation, item);
                    //20%概率再次掉落一个
                    const item2 = CreateItem(this.equipmentPool4[RandomInt(0, this.equipmentPool4.length - 1)], getPlayerOwner, getPlayerOwner);
                    if (!RollPercentage(10 + addPercent)) {
                        return;
                    }
                    this.dropItem(deathLocation, item2);
                }
                if (killed.GetUnitName().includes('custom_unit_box2')) {
                    //开箱
                    this.openBox(killed);
                    //创建新箱子
                    this.createNewBox(killed.GetUnitName());
                    //掉落装备
                    const item = CreateItem(this.equipmentPool2[RandomInt(0, this.equipmentPool2.length - 1)], getPlayerOwner, getPlayerOwner);
                    this.dropItem(deathLocation, item);
                    //20%概率再次掉落一个
                    const item2 = CreateItem(this.equipmentPool4[RandomInt(0, this.equipmentPool4.length - 1)], getPlayerOwner, getPlayerOwner);
                    if (!RollPercentage(20 + addPercent)) {
                        return;
                    }
                    this.dropItem(deathLocation, item2);
                }
                if (killed.GetUnitName().includes('custom_unit_box3')) {
                    //开箱
                    this.openBox(killed);
                    //创建新箱子
                    this.createNewBox(killed.GetUnitName());
                    //掉落装备
                    const item = CreateItem(this.equipmentPool3[RandomInt(0, this.equipmentPool3.length - 1)], getPlayerOwner, getPlayerOwner);
                    this.dropItem(deathLocation, item);
                    //20%概率再次掉落一个
                    const item2 = CreateItem(this.equipmentPool4[RandomInt(0, this.equipmentPool4.length - 1)], getPlayerOwner, getPlayerOwner);
                    if (!RollPercentage(30 + addPercent)) {
                        return;
                    }
                    this.dropItem(deathLocation, item2);
                }
                if (killed.GetUnitName().includes('custom_unit_box4')) {
                    //开箱
                    this.openBox(killed);
                    //创建新箱子
                    this.createNewBox(killed.GetUnitName());
                    //掉落装备
                    const item = CreateItem(this.equipmentPool4[RandomInt(0, this.equipmentPool4.length - 1)], getPlayerOwner, getPlayerOwner);
                    this.dropItem(deathLocation, item);
                    //20%概率再次掉落一个
                    const item2 = CreateItem(this.equipmentPool4[RandomInt(0, this.equipmentPool4.length - 1)], getPlayerOwner, getPlayerOwner);
                    if (!RollPercentage(40 + addPercent)) {
                        return;
                    }
                    this.dropItem(deathLocation, item2);
                }
                if (killed.GetUnitName().includes('custom_unit_box5')) {
                    //开箱
                    this.openBox(killed);
                    //创建新箱子
                    this.createNewBox(killed.GetUnitName());
                    //掉落装备
                    const item = CreateItem(this.equipmentPool4[RandomInt(0, this.equipmentPool4.length - 1)], getPlayerOwner, getPlayerOwner);
                    this.dropItem(deathLocation, item);
                    //20%概率再次掉落一个
                    const item2 = CreateItem(this.equipmentPool4[RandomInt(0, this.equipmentPool4.length - 1)], getPlayerOwner, getPlayerOwner);
                    if (!RollPercentage(20)) {
                        return;
                    }
                    this.dropItem(deathLocation, item2);
                }
            },
            null
        );
    }

    private openBox(killed: CDOTA_BaseNPC) {
        killed.Destroy();
        const open = CreateUnitByName(killed.GetUnitName() + 'Open', killed.GetAbsOrigin(), true, null, null, DotaTeam.BADGUYS);
        Timers.CreateTimer(0, () => {
            open.ForceKill(true);
        });
    }

    private dropItem(vector: Vector, item: CDOTA_Item) {
        //0.5秒之后掉落装备
        Timers.CreateTimer(0.3, () => {
            //创建装备
            CreateItemOnPositionSync(vector, item);
            //然后播放掉落动画
            item.LaunchLoot(false, 300, 0.5, vector.__add(RandomVector(300)), null);
        });
    }

    createNewBox(name: String) {
        // 假设已经有了Vector类型和相关DOTA团队常量的定义
        // @ts-ignore
        const minX = -7000;
        const maxX = 7000;
        const minY = -7000;
        const maxY = 7000;

        // 生成随机坐标
        const x = Math.random() * (maxX - minX) + minX;
        const y = Math.random() * (maxY - minY) + minY;
        const z = 0;
        // 使用指定的坐标创建位置向量
        const spawnLocation = Vector(x, y, z);
        // @ts-ignore
        const createdUnit = CreateUnitByName(name, spawnLocation, true, null, null, 3);
    }
}
