// import { BaseAbility, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';
// @registerAbility('item_h')
// class item_h extends BaseAbility {
//     GetIntrinsicModifierName() {
//         return 'modifier_split_arrows';
//     }
//
//     OnProjectileHit(hTarget, vLocation): boolean {
//         if (hTarget) {
//             ApplyDamage({
//                 victim: hTarget,
//                 attacker: this.GetCaster(),
//                 damage: 100, // 从技能获取伤害值
//                 damage_type: this.GetAbilityDamageType(),
//                 ability: this,
//             });
//             // 这里可以添加击中效果的粒子效果
//         }
//         return false; // 这样ProjectileManager就知道这个函数已经处理过投射物命中事件
//     }
// }
//
// @registerModifier('modifier_split_arrows')
// class modifier_split_arrows extends BaseModifier {
//     IsHidden(): boolean {
//         return false; // Modifier不会被隐藏
//     }
//
//     DeclareFunctions(): ModifierFunction[] {
//         return [ModifierFunction.ON_ATTACK_LANDED];
//     }
//
//     OnAttackLanded(event: ModifierAttackEvent): void {
//         const parent = this.GetParent();
//
//         // 确保是由Modifier持有者的攻击触发的
//         if (parent !== event.attacker) {
//             return;
//         }
//
//         // 获取周围的敌人单位
//         const enemies = FindUnitsInRadius(
//             parent.GetTeamNumber(),
//             parent.GetAbsOrigin(),
//             null,
//             500, // 搜索半径
//             DOTA_UNIT_TARGET_TEAM_ENEMY,
//             DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC,
//             DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES | DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE,
//             FindOrder.ANY,
//             false
//         );
//
//         // 对每个目标发射额外的箭矢
//         enemies.forEach(enemy => {
//             // 避免对原始攻击目标再次发射
//             if (enemy !== event.target) {
//                 // 创建一个跟踪投射物
//                 const info = {
//                     Target: enemy,
//                     Source: parent,
//                     Ability: this.GetAbility(),
//                     EffectName: 'particles/units/heroes/hero_drow/drow_base_attack.vpcf', // 选择合适的投射物粒子效果
//                     iMoveSpeed: 900,
//                     vSourceLoc: parent.GetAbsOrigin(), // 发射源位置
//                     bDrawsOnMinimap: false, // 不在小地图上绘制
//                     bDodgeable: true, // 可被躲避
//                     bIsAttack: false, // 不算作普通攻击
//                     bVisibleToEnemies: true, // 敌人可见
//                     bReplaceExisting: false,
//                     flExpireTime: GameRules.GetGameTime() + 10, // 10秒后投射物过期
//                     bProvidesVision: true, // 提供视野
//                     iVisionRadius: 100,
//                     iVisionTeamNumber: parent.GetTeamNumber(),
//                 };
//                 ProjectileManager.CreateTrackingProjectile(info);
//             }
//         });
//     }
//
//     // 当投射物击中目标时
// }
