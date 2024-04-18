import { BaseModifier, registerModifier } from './utils/dota_ts_adapter';

@registerModifier('maxSpeed')
export class maxSpeed extends BaseModifier {
    OnCreated() {}

    DeclareFunctions() {
        return [ModifierFunction.IGNORE_MOVESPEED_LIMIT, ModifierFunction.MOVESPEED_BONUS_CONSTANT];
    }

    GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        return 1; // 如果你想忽略移动速度上限，返回1。如果不忽略，返回0。
    }

    GetModifierMoveSpeedBonus_Constant(): number {
        return 100000;
    }
}
