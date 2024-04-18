import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_e')
class item_e extends BaseAbility {
    GetIntrinsicModifierName() {
        print('我是永久光环');
        return 'modifier_damage_aura';
    }
}

@registerModifier('modifier_damage_aura')
class modifier_damage_aura extends BaseModifier {
    OnCreated(params: object): void {
        if (IsServer()) {
            print('光环粒子特效');
            const particleName: string = 'particles/econ/items/ember_spirit/ember_ti9/ember_ti9_flameguard_shield_outer.vpcf';
            ParticleManager.CreateParticle(particleName, ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent());
            // 如果有需要，设置粒子控制点
            // ParticleManager.SetParticleControl(this.auraEffectIndex, 0, this.GetParent().GetAbsOrigin());
        }
    }

    // OnDestroy(): void {
    //     if (IsServer() && this.auraEffectIndex !== undefined) {
    //         ParticleManager.DestroyParticle(this.auraEffectIndex, false);
    //         ParticleManager.ReleaseParticleIndex(this.auraEffectIndex);
    //     }
    // }

    IsAura(): boolean {
        return true; // 表示这是一个光环 Modifier
    }

    GetAuraRadius(): number {
        return 300; // 光环的作用范围
    }

    GetAuraSearchTeam() {
        return UnitTargetTeam.ENEMY;
    }

    GetAuraSearchType() {
        return UnitTargetType.ALL;
    }

    GetAuraSearchFlags() {
        return UnitTargetFlags.NONE;
    }

    GetModifierAura(): string {
        return 'modifier_damage_aura_effect'; // 提供的光环效果 Modifier 名称
    }
}

@registerModifier('modifier_damage_aura_effect')
class modifier_damage_aura_effect extends BaseModifier {
    OnCreated(params: object): void {
        print('我触发了');
        if (IsServer()) {
            print('我触发了我是service');
            this.StartIntervalThink(0.1); // 每秒触发一次伤害
        }
    }

    OnIntervalThink(): void {
        const parent = this.GetParent(); // 受到影响的单位
        const damage = 10; // 每次触发的伤害值
        print('我是每秒触发的');
        const damageTable = {
            victim: this.GetParent(),
            attacker: this.GetAbility().GetCaster(),
            damage: 5,
            damage_type: this.GetAbility().GetAbilityDamageType(),
            ability: this.GetAbility(),
        };
        // @ts-ignore
        ApplyDamage(damageTable);
    }
}
