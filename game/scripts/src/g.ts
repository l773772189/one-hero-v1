import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_g')
class item_g extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'modifier_g';
    }
}

@registerModifier('modifier_g')
class modifier_g extends BaseModifier {
    OnCreated() {
        print('刃甲创建了');
        ParticleManager.CreateParticle(
            'particles/econ/items/spectre/spectre_arcana/spectre_arcana_blademail.vpcf',
            ParticleAttachment.ABSORIGIN_FOLLOW,
            this.GetParent()
        );
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE];
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        // 检查受到伤害的单位是否是这个Modifier的持有者
        if (event.unit !== this.GetParent()) {
            return;
        }

        // 创建一个伤害表
        const damageTable = {
            victim: event.attacker, // 攻击者
            attacker: this.GetParent(), // 反击者，即这个Modifier的持有者
            damage: 10,
            damage_type: this.GetAbility().GetAbilityDamageType(), // 伤害类型，这里使用纯粹伤害
            ability: this.GetAbility(), // 触发这个伤害的技能
        };

        // 应用伤害到攻击者
        ApplyDamage(damageTable);
    }
}
