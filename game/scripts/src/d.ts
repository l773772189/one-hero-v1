import { BaseItem, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_d')
class item_d extends BaseItem {
    GetIntrinsicModifierName() {
        return 'dd';
    }

    public OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): void {
        // 确保目标有效
        if (!target) return;
        // 假设target是被击中的单位，这里是CDOTA_BaseNPC类型
        const damageTable = {
            victim: target,
            attacker: this.GetCaster(),
            damage: 100,
            damage_type: this.GetAbilityDamageType(),
            ability: this,
        };
        // @ts-ignore
        ApplyDamage(damageTable);
    }
}

// @ts-ignore
@registerModifier('dd')
class dd extends BaseModifier {
    // @ts-ignore
    DeclareFunctions() {
        return [ModifierFunction.ON_ATTACK_LANDED];
    }

    OnAttackLanded(event: ModifierAttackEvent) {
        if (event.attacker != this.GetCaster()) {
            return;
        }
        if (!RollPercentage(100)) {
            return;
        }

        const directions: Vector[] = [
            Vector(0, 1, 0), // 上
            Vector(0, -1, 0), // 下
            Vector(-1, 0, 0), // 左
            Vector(1, 0, 0), // 右
            Vector(-1, 1, 0).Normalized(), // 左上
            Vector(1, 1, 0).Normalized(), // 右上
            Vector(-1, -1, 0).Normalized(), // 左下
            Vector(1, -1, 0).Normalized(), // 右下
        ];
        const caster = this.GetCaster();

        directions.forEach(dir => {
            const projectile_name = 'particles/econ/items/lina/lina_head_headflame/lina_spell_dragon_slave_headflame.vpcf';
            const options: CreateLinearProjectileOptions = {
                EffectName: projectile_name,
                Source: caster,
                Ability: this.GetAbility(), // 假设这段代码在一个技能的类中
                vSpawnOrigin: caster.GetAbsOrigin(), // 投射物的起始位置
                vVelocity: dir.__mul(1000), // 投射物的速度向量
                fDistance: 800, // 投射物的最大距离
                fStartRadius: 100, // 投射物的起始半径
                fEndRadius: 100, // 投射物的结束半径
                iUnitTargetTeam: UnitTargetTeam.ENEMY, // 投射物可以命中的单位队伍
                iUnitTargetFlags: UnitTargetFlags.NONE, // 目标标志
                iUnitTargetType: UnitTargetType.ALL, // 投射物可以命中的单位类型
                bVisibleToEnemies: true, // 敌人是否可见
            };
            ProjectileManager.CreateLinearProjectile(options);
        });
        EmitSoundOn('Hero_Lina.DragonSlave', caster);
    }
}
