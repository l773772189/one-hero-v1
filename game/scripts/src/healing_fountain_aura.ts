import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('healing_fountain_aura')
class healing_fountain_aura extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'healing_fountain_aura_modifier';
    }
}

@registerModifier('healing_fountain_aura_modifier')
class healing_fountain_aura_modifier extends BaseModifier {
    radius = 900;

    IsHidden(): boolean {
        return false;
    }

    CheckState(): { [state: string]: boolean } {
        return {
            [ModifierState.INVULNERABLE]: true, // 使单位无敌
        };
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
        return 'healing_fountain_aura_modifier_effect';
    }

    RemoveOnDeath(): boolean {
        return true;
    }
}

@registerModifier('healing_fountain_aura_modifier_effect')
class healing_fountain_aura_modifier_effect extends BaseModifier {
    OnCreated() {
        const pa = ParticleManager.CreateParticle(
            'particles/units/heroes/hero_witchdoctor/witchdoctor_voodoo_restoration_heal.vpcf',
            ParticleAttachment.ABSORIGIN_FOLLOW,
            this.GetParent()
        );
    }

    GetModifierConstantManaRegen() {
        return 200;
    }

    GetModifierConstantHealthRegen() {
        return 200;
    }

    DeclareFunctions() {
        return [ModifierFunction.HEALTH_REGEN_CONSTANT, ModifierFunction.MANA_REGEN_CONSTANT];
    }

    IsHidden(): boolean {
        return false;
    }
}
