import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_ddsc')
class item_ddsc extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'item_ddsc_modifier';
    }

    OnSpellStart() {
        print('技能开始时');
    }

    public OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): void {
        print('投射物打到人了');
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

// @ts-ignore
@registerModifier('item_ddsc_modifier')
class item_ddsc_modifier extends BaseModifier {
    DeclareFunctions() {
        //比如如下代码，我想去除ts的提示
        return [ModifierFunction.ON_ATTACK_LANDED, ModifierFunction.ON_TAKEDAMAGE];
    }

    OnCreated(params: object): void {
        if (IsServer()) {
            ParticleManager.CreateParticle(
                'particles/econ/items/spectre/spectre_arcana/spectre_arcana_blademail.vpcf',
                ParticleAttachment.ABSORIGIN_FOLLOW,
                this.GetParent()
            );
        }
        if (IsServer()) {
            print('我触发了我是service');
            this.StartIntervalThink(0.1); // 每秒触发一次伤害
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

    //攻击时
    // @ts-ignore
    OnAttackLanded(event: ModifierInstanceEvent) {
        // 检查受到伤害的单位是否是这个Modifier的持有者
        if (event.attacker != this.GetCaster()) {
            return;
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
