import { BaseAbility, registerAbility } from './utils/dota_ts_adapter';

@registerAbility('c')
class c extends BaseAbility {
    OnSpellStart() {
        const caster = this.GetCaster();
        const target = this.GetCursorTarget();
        const position = this.GetCursorPosition();
        const projectile_name = 'particles/econ/items/lina/lina_head_headflame/lina_spell_dragon_slave_headflame_d.vpcf';
        const options: CreateLinearProjectileOptions = {
            EffectName: projectile_name,
            Source: caster,
            Ability: this, // 假设这段代码在一个技能的类中
            vSpawnOrigin: caster.GetAbsOrigin(), // 投射物的起始位置
            vVelocity: Vector(1, 1, 1), // 投射物的速度向量
            fDistance: 1200, // 投射物的最大距离
            fStartRadius: 100, // 投射物的起始半径
            fEndRadius: 100, // 投射物的结束半径
            iUnitTargetTeam: UnitTargetTeam.BOTH, // 投射物可以命中的单位队伍
            iUnitTargetFlags: UnitTargetFlags.NONE, // 目标标志
            iUnitTargetType: UnitTargetType.ALL, // 投射物可以命中的单位类型
            bVisibleToEnemies: true, // 敌人是否可见
        };
        ProjectileManager.CreateLinearProjectile(options);
    }
}
