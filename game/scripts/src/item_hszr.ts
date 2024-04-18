import { BaseAbility, BaseItem, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_hszr')
class item_hszr extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'item_hszr_modifier';
    }

    public OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): void {
        const damageTable = {
            victim: target,
            attacker: this.GetCaster(),
            damage: 5,
            damage_type: this.GetAbilityDamageType(),
            ability: this,
        };
        ApplyDamage(damageTable);
    }
}

@registerModifier('item_hszr_modifier')
class item_hszr_modifier extends BaseModifier {
    DeclareFunctions() {
        return [ModifierFunction.ON_ATTACK_LANDED];
    }

    //攻击时
    OnAttackLanded(event: ModifierAttackEvent) {
        // 确保事件的攻击者是这个Modifier的持有者
        if (event.attacker !== this.GetParent()) {
            return;
        }
        if (!RollPercentage(15)) {
            return;
        }
        const caster = this.GetParent() as CDOTA_BaseNPC_Hero;

        // 遍历英雄身上的所有物品
        let projectileCount = 0; // 默认为0道
        print('1');
        for (let i = 0; i < caster.GetNumItemsInInventory(); i++) {
            print('2');
            const item = caster.GetItemInSlot(i);
            if (item) {
                print('3');
                const itemData = item.GetAbilityKeyValues(); // 获取该物品的KV数据
                print(`tag是：${itemData['tag']}`);
                if (typeof itemData['tag'] == 'string' && itemData['tag'].includes('hs')) {
                    print('4');
                    // 检查装备等级，并更新道数
                    const itemLevel = parseInt(itemData['level'], 10); // 确保转换为数字类型
                    if (itemLevel == 2) {
                        print('5');
                        projectileCount = Math.max(projectileCount, 1); // 如果存在等级为2的装备，设置道数为1
                    } else if (itemLevel == 3) {
                        print('6');
                        projectileCount = Math.max(projectileCount, 3); // 如果存在等级为3的装备，设置道数为3
                    }
                }
            }
        }

        // 根据道数调整发射方向
        let directions: Vector[] = [];
        const forward = caster.GetForwardVector(); // 获取英雄面对的方向
        if (projectileCount == 1) {
            // 只有一道时，直接发射
            directions = [forward];
        } else if (projectileCount == 3) {
            // 三道时，添加左前方和右前方
            const left = RotatePosition(Vector(0, 0, 0), QAngle(0, -45, 0), forward); // 左前方45度
            const right = RotatePosition(Vector(0, 0, 0), QAngle(0, 45, 0), forward); // 右前方45度
            directions = [left, forward, right];
        }

        if (directions.length == 0) {
            return;
        }

        directions.forEach(dir => {
            const projectile_name = 'particles/units/heroes/hero_lina/lina_spell_dragon_slave.vpcf';
            const options: CreateLinearProjectileOptions = {
                EffectName: projectile_name,
                Source: caster,
                Ability: this.GetAbility(),
                vSpawnOrigin: caster.GetAbsOrigin(),
                vVelocity: dir.__mul(1000), // 将方向乘以速度得到速度向量
                fDistance: 2000,
                fStartRadius: 100,
                fEndRadius: 500,
                iUnitTargetTeam: UnitTargetTeam.ENEMY,
                iUnitTargetFlags: UnitTargetFlags.NONE,
                iUnitTargetType: UnitTargetType.ALL,
                bVisibleToEnemies: true,
            };
            ProjectileManager.CreateLinearProjectile(options);
        });
        EmitSoundOn('Hero_Lina.DragonSlave', caster);
    }
}
