import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('ability_unit_td_052_1_tt_ability')
class ability_unit_td_052_1_tt_ability extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'modifier_ability_unit_td_052_1_tt_ability';
    }
}
