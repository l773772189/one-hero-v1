import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('b')
class b extends BaseAbility {
    // GetIntrinsicModifierName() {
    //     return 'c';
    // }

    OnSpellStart() {
        const caster = this.GetCaster();
        const ability = this;
        const duration = 10; // 总持续时间，根据需要调整
        const interval = 1; // 发射间隔
        const range = 600; // 效果范围
        const damage = 100; // 造成的伤害

        caster.AddNewModifier(caster, ability, 'c', { duration: duration });

        EmitSoundOn('Hero_Tinker.MissileAnim', caster);
        //1 音效的问题
        //2 触发器不生效
        //3 触发器的好处
    }

    // 定义投射物命中敌人时的处理
    OnProjectileHit(target, location) {
        if (target) {
            // 造成伤害
            const damageInfo = {
                victim: target,
                attacker: this.GetCaster(),
                damage: 10,
                damage_type: DamageTypes.MAGICAL,
                ability: this,
            };
            ApplyDamage(damageInfo);
        }
    }
}

@registerModifier('c')
class c extends BaseModifier {
    isHidden() {
        return false;
    }

    OnCreated() {
        const caster = this.GetParent();
        const ability = this.GetAbility();
        let duration = 10; // 总持续时间，根据需要调整
        const interval = 1; // 发射间隔
        const range = 600; // 效果范围
        const damage = 100; // 造成的伤害
        if (IsClient()) {
            return;
        }
        Timers.CreateTimer(0, function () {
            // 搜索范围内的敌人单位
            const enemies = FindUnitsInRadius(
                caster.GetTeamNumber(),
                caster.GetAbsOrigin(),
                null,
                range,
                UnitTargetTeam.BOTH,
                UnitTargetType.ALL,
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false
            );

            // 对每个敌人发射投射物
            enemies.forEach(enemy => {
                const projectileInfo = {
                    EffectName: 'particles/units/heroes/hero_tinker/tinker_missile.vpcf', // 投射物的特效名，根据需要填写
                    Ability: ability,
                    vSpawnOrigin: caster.GetAbsOrigin(),
                    Source: caster,
                    bHasFrontalCone: false,
                    iMoveSpeed: 900, // 投射物速度，根据需要调整
                    Target: enemy,
                    iVisionTeamNumber: caster.GetTeamNumber(),
                    iVisionRadius: 0,
                    bProvidesVision: false,
                };
                ProjectileManager.CreateTrackingProjectile(projectileInfo);
            });

            duration -= interval;
            if (duration > 0) {
                return interval; // 重复定时器
            }
        });
    }
}
