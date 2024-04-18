import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_ryzd')
class item_ryzd extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'item_ryzd_modifier';
    }
}

@registerModifier('item_ryzd_modifier')
class item_ryzd_modifier extends BaseModifier {
    particleId: ParticleID; // 声明一个变量来存储粒子效果的ID

    DeclareFunctions() {
        //比如如下代码，我想去除ts的提示
        return [ModifierFunction.ON_ATTACK_LANDED, ModifierFunction.ON_TAKEDAMAGE];
    }

    OnCreated(params: object): void {
        if (IsServer()) {
            this.particleId = ParticleManager.CreateParticle(
                'particles/units/heroes/hero_abaddon/abaddon_borrowed_time.vpcf',
                ParticleAttachment.ABSORIGIN_FOLLOW,
                this.GetParent()
            );
        }

        const damageInterval = Timers.CreateTimer(1, () => {
            // 查找范围内的敌人单位
            const enemies = FindUnitsInRadius(
                this.GetCaster().GetTeamNumber(),
                this.GetAbility().GetCaster().GetAbsOrigin(),
                null,
                500,
                UnitTargetTeam.ENEMY,
                UnitTargetType.BASIC | UnitTargetType.HERO,
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false
            );

            // 对每个敌人造成伤害
            for (const enemy of enemies) {
                enemy.AddNewModifier(this.GetCaster(), this.GetAbility(), 'modifier_slow_effect', { duration: 3 });
            }

            for (const enemy of enemies) {
                const damageTable = {
                    victim: enemy,
                    attacker: this.GetCaster(),
                    damage: 10,
                    damage_type: DamageTypes.MAGICAL,
                    ability: this.GetAbility(),
                };
                ApplyDamage(damageTable);
            }

            return 0.2; // 每秒重复
        });
    }

    OnDestroy(): void {
        if (IsServer()) {
            // 销毁粒子效果
            ParticleManager.DestroyParticle(this.particleId, false);
            ParticleManager.ReleaseParticleIndex(this.particleId);
        }
    }
}
