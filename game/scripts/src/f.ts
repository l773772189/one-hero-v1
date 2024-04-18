import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_f')
class item_f extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'modifier_damage_aura';
    }
}
//particles/econ/items/invoker/invoker_ti6/invoker_tornado_ti6_funnel.vpcf
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
