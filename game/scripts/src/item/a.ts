import { BaseItem, BaseModifier, registerAbility, registerModifier } from '../utils/dota_ts_adapter';
import { reloadable } from '../utils/tstl-utils';
@reloadable
@registerAbility('item_hszr2')
class item_hszr2 extends BaseItem {
    Spawn(): void {}

    GetIntrinsicModifierName() {
        return 'item_hszr2_modifier';
    }
}

@registerModifier('item_hszr2_modifier')
class item_hszr2_modifier extends BaseModifier {
    DeclareFunctions() {
        return [ModifierFunction.ON_ATTACK_START, ModifierFunction.ON_ATTACK_LANDED];
    }

    OnAttackLanded(event: ModifierAttackEvent) {
        if (event.attacker !== this.GetParent() || this.GetParent().IsIllusion()) {
            return;
        }

        const chance = 100;
        if (RandomInt(1, 100) <= chance) {
            this.CastChaosMeteor(event.target.GetAbsOrigin(), event.attacker);
        }
    }

    CastChaosMeteor(targetPosition: Vector, attacker: CDOTA_BaseNPC): void {
        print('释放了');
        const invoker = this.GetParent();
        const addAbility = attacker.AddAbility('invoker_chaos_meteor');
        addAbility.SetLevel(1);
        addAbility.SetHidden(false);
        // addAbility.CastAbility();
        attacker.CastAbilityOnPosition(targetPosition, addAbility, 0);
    }
}
