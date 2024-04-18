import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_ddsc')
class item_ddsc extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'item_ddsc_modifier';
    }
}

@registerModifier('item_ddsc_modifier')
class item_ddsc_modifier extends BaseModifier {
    particleId: ParticleID; // 声明一个变量来存储粒子效果的ID

    DeclareFunctions() {
        //比如如下代码，我想去除ts的提示
        return [ModifierFunction.ON_ATTACK_LANDED, ModifierFunction.ON_TAKEDAMAGE];
    }

    OnCreated(params: object): void {
        if (IsServer()) {
            this.particleId = ParticleManager.CreateParticle(
                'particles/econ/items/spectre/spectre_arcana/spectre_arcana_blademail.vpcf',
                ParticleAttachment.ABSORIGIN_FOLLOW,
                this.GetParent()
            );
        }
    }

    //被攻击时
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

    OnDestroy(): void {
        if (IsServer()) {
            // 销毁粒子效果
            ParticleManager.DestroyParticle(this.particleId, false);
            ParticleManager.ReleaseParticleIndex(this.particleId);
        }
    }
}
