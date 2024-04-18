import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('ability_unit_td_052_1')
class ability_unit_td_052_1 extends BaseAbility {
    OnSpellStart() {
        const position = this.GetCursorPosition();
        const caster = this.GetCaster();
        const team = caster.GetPlayerOwner().GetTeam();
        const a = CreateUnitByName('ability_unit_td_052_1_tt', position, true, caster, caster, team);
        a.AddNewModifier(caster, this, 'modifier_ability_unit_td_052_1_tt_ability', { duration: 5 });
    }
}
@registerModifier('modifier_ability_unit_td_052_1_tt_ability')
class ability_unit_td_052_1_tt_ability_modifier extends BaseModifier {
    OnCreated() {}

    radius = 900;
    GetModifierAttackSpeedBonus_Constant() {
        return 200;
    }

    DeclareFunctions() {
        return [ModifierFunction.ATTACKSPEED_BONUS_CONSTANT];
    }

    IsHidden(): boolean {
        return false;
    }

    IsAura(): boolean {
        return true;
    }

    GetAuraSearchTeam() {
        return UnitTargetTeam.BOTH;
    }

    GetAuraSearchType() {
        return UnitTargetType.ALL;
    }

    GetAuraSearchFlags() {
        return UnitTargetFlags.NONE;
    }

    GetAuraOwner() {
        return this.GetParent();
    }

    GetAuraRadius(): number {
        return this.radius;
    }

    GetModifierAura() {
        return 'modifier_' + this.GetAbility().GetName();
    }

    RemoveOnDeath(): boolean {
        return true;
    }
}
