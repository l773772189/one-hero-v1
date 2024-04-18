import { BaseAbility, BaseItem, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_xrtz')
class item_xrtz extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'item_xrtz_modifier';
    }

    public OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): void {
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

@registerModifier('item_xrtz_modifier')
class item_xrtz_modifier extends BaseModifier {
    DeclareFunctions() {
        return [ModifierFunction.ON_ATTACK_LANDED];
    }

    //攻击时
    OnAttackLanded(event: ModifierAttackEvent) {
        // 确保事件的攻击者是这个Modifier的持有者
        if (event.attacker !== this.GetParent()) {
            return;
        }
        if (!RollPercentage(15)) {
            return;
        }
        const caster = this.GetParent() as CDOTA_BaseNPC_Hero;

        // 遍历英雄身上的所有物
        const projectileCount = 3;
        // 根据道数调整发射方向
        let directions: Vector[] = [];
        const forward = caster.GetForwardVector(); // 获取英雄面对的方向
        const left = RotatePosition(Vector(0, 0, 0), QAngle(0, -45, 0), forward); // 左前方45度
        const right = RotatePosition(Vector(0, 0, 0), QAngle(0, 45, 0), forward); // 右前方45度
        directions = [left, forward, right];

        if (directions.length == 0) {
            return;
        }

        directions.forEach(dir => {
            const projectile_name = 'particles/units/heroes/hero_queenofpain/queen_sonic_wave.vpcf';
            const options: CreateLinearProjectileOptions = {
                EffectName: projectile_name,
                Source: caster,
                Ability: this.GetAbility(),
                vSpawnOrigin: caster.GetAbsOrigin(),
                vVelocity: dir.__mul(1000), // 将方向乘以速度得到速度向量
                fDistance: 2000,
                fStartRadius: 100,
                fEndRadius: 500,
                iUnitTargetTeam: UnitTargetTeam.ENEMY,
                iUnitTargetFlags: UnitTargetFlags.NONE,
                iUnitTargetType: UnitTargetType.ALL,
                bVisibleToEnemies: true,
            };
            ProjectileManager.CreateLinearProjectile(options);
        });
        EmitSoundOn('Hero_QueenOfPain.SonicWave', caster);
    }
}
