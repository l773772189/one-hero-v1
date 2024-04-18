import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_fszg')
class item_fszg extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'item_fszg_modifier';
    }

    public OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): void {
        print('投射物打到人了');
        const damageTable = {
            victim: target,
            attacker: this.GetCaster(),
            damage: this.GetCaster().GetDamageMax(),
            damage_type: this.GetAbilityDamageType(),
            ability: this,
        };
        ApplyDamage(damageTable);
    }
}

// @ts-ignore
@registerModifier('item_fszg_modifier')
class item_fszg_modifier extends BaseModifier {
    DeclareFunctions() {
        //比如如下代码，我想去除ts的提示
        return [ModifierFunction.ON_ATTACK];
    }

    //攻击时
    // @ts-ignore
    OnAttack(event: ModifierInstanceEvent) {
        // 检查受到伤害的单位是否是这个Modifier的持有者
        if (event.attacker != this.GetCaster()) {
            return;
        }
        // 获取周围的敌人单位
        const enemies = FindUnitsInRadius(
            this.GetAbility().GetCaster().GetTeamNumber(),
            this.GetAbility().GetCaster().GetAbsOrigin(),
            null,
            600, // 搜索半径
            UnitTargetTeam.ENEMY,
            UnitTargetType.ALL,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );

        // 对每个目标发射额外的箭矢
        enemies.forEach(enemy => {
            const unitKV = GetUnitKeyValuesByName(this.GetAbility().GetCaster().GetUnitName());
            const projectileModel = unitKV['ProjectileModel'];
            const projectileSpeed = unitKV['ProjectileSpeed'];
            // 避免对原始攻击目标再次发射
            if (enemy != event.unit) {
                // 创建一个跟踪投射物
                const info = {
                    Target: enemy,
                    Source: this.GetAbility().GetCaster(),
                    Ability: this.GetAbility(),
                    EffectName: projectileModel, // 选择合适的投射物粒子效果
                    iMoveSpeed: projectileSpeed,
                    vSourceLoc: this.GetAbility().GetCaster().GetAbsOrigin(), // 发射源位置
                    bDrawsOnMinimap: false, // 不在小地图上绘制
                    bDodgeable: true, // 可被躲避
                    bIsAttack: false, // 不算作普通攻击
                    bVisibleToEnemies: true, // 敌人可见
                    bReplaceExisting: false,
                    flExpireTime: GameRules.GetGameTime() + 10, // 10秒后投射物过期
                    bProvidesVision: true, // 提供视野
                    iVisionRadius: 100,
                    iVisionTeamNumber: this.GetAbility().GetCaster().GetTeamNumber(),
                };
                ProjectileManager.CreateTrackingProjectile(info);
            }
        });
    }
}
