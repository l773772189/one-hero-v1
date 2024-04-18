import { UniqueWeapon } from './UniqueWeapon';

export class Other {
    neutralUnitNames: string[] = [
        'npc_dota_neutral_kobold',
        'npc_dota_neutral_kobold_tunneler',
        'npc_dota_neutral_kobold_foreman',
        'npc_dota_neutral_centaur_khan',
        'npc_dota_neutral_centaur_outrunner',
        'npc_dota_neutral_giant_wolf',
        'npc_dota_neutral_alpha_wolf',
        'npc_dota_neutral_gnoll_assassin',
        'npc_dota_neutral_satyr_soulstealer',
        'npc_dota_neutral_satyr_trickster',
        'npc_dota_neutral_satyr_hellcaller',
    ];

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
        Timers.CreateTimer(1, () => {
            const player = PlayerResource.GetPlayer(0);
            const hero = player.GetAssignedHero();
        });

        for (let i = 0; i < 50; i++) {
            this.createBox('custom_unit_box1');
        }
        for (let i = 0; i < 16; i++) {
            this.createBox('custom_unit_box2');
        }
        for (let i = 0; i < 8; i++) {
            this.createBox('custom_unit_box3');
        }
        for (let i = 0; i < 4; i++) {
            this.createBox('custom_unit_box4');
        }
        for (let i = 0; i < 4; i++) {
            this.createBox('custom_unit_box5');
        }
        // for (let i = 0; i < 100; i++) {
        //     const index = Math.floor(Math.random() * neutralUnitNames.length);
        //     createBox(neutralUnitNames[index]);
        // }

        ListenToGameEvent(
            'entity_killed',
            event => {
                const killedUnit = EntIndexToHScript(event.entindex_killed) as CDOTA_BaseNPC;
                const unit = EntIndexToHScript(event.entindex_attacker) as CDOTA_BaseNPC;
                if (killedUnit.IsHero()) {
                    const hero = killedUnit as CDOTA_BaseNPC_Hero;
                    const item = hero.FindItemInInventory('item_fss');
                    if (item != null) {
                        item.Destroy();
                        const respawnVector = hero.GetAbsOrigin();
                        hero.SetRespawnPosition(respawnVector);
                        hero.SetTimeUntilRespawn(3);
                        const particle = ParticleManager.CreateParticle(
                            'particles/econ/items/sniper/sniper_charlie/sniper_crosshair_charlie.vpcf',
                            ParticleAttachment.WORLDORIGIN,
                            null
                        );
                        ParticleManager.SetParticleControl(particle, 0, respawnVector);
                        Timers.CreateTimer(3, () => {
                            ParticleManager.DestroyParticle(particle, false);
                            ParticleManager.ReleaseParticleIndex(particle);
                        });
                    }
                    return;
                }
                const anotherVector = Vector(killedUnit.GetAbsOrigin().x, killedUnit.GetAbsOrigin().y + 100, killedUnit.GetAbsOrigin().z);
                if (killedUnit.GetUnitName().includes('creep')) {
                    if (!RollPercentage(5)) {
                        return;
                    }
                    CreateItemOnPositionSync(
                        killedUnit.GetAbsOrigin(),
                        CreateItem(this.equipmentPool4[RandomInt(0, this.equipmentPool4.length - 1)], null, null)
                    );
                }
            },
            undefined
        );
        new UniqueWeapon();
    }

    createBox(name: String) {
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

    SetHeroLevel(hero: CDOTA_BaseNPC_Hero, level: number) {
        // 确保英雄的当前等级低于目标等级
        while (hero.GetLevel() < level) {
            hero.HeroLevelUp(false); // false 表示升级时不播放声音
        }
    }
}
