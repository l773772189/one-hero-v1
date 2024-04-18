import { BaseModifier, registerModifier } from './utils/dota_ts_adapter';

/**
 * 非设置血量的 绝对伤害无效化
 */
@registerModifier('modifier_wearable')
export class modifier_wearable extends BaseModifier {
    IsHidden() {
        return true;
    }

    IsPurgable() {
        return false;
    }

    IsDebuff() {
        return false;
    }

    RemoveOnDeath() {
        return true;
    }

    CheckState() {
        return {
            [ModifierState.OUT_OF_GAME]: true, //游戏外
            [ModifierState.NO_UNIT_COLLISION]: true, //无单位碰撞
            [ModifierState.NO_HEALTH_BAR]: true, //无血条
        };
    }

    OnCreated() {
        if (IsClient()) {
            return;
        }
    }

    OnDestroy() {}
}
