import { BaseAbility, BaseItem, BaseModifier, registerAbility, registerModifier } from './utils/dota_ts_adapter';

@registerAbility('item_sszj')
class item_sszj extends BaseAbility {
    GetIntrinsicModifierName() {
        return 'item_sszj_modifier';
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

@registerModifier('item_sszj_modifier')
class item_sszj_modifier extends BaseModifier {
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
        const directions: Vector[] = [];
        const heroPosition = caster.GetAbsOrigin(); // 获取英雄的当前位置
        const a = Vector(heroPosition.x + 200, heroPosition.y, heroPosition.z);
        const b = Vector(heroPosition.x - 200, heroPosition.y, heroPosition.z);
        const c = Vector(heroPosition.x, heroPosition.y + 200, heroPosition.z);
        const d = Vector(heroPosition.x, heroPosition.y - 200, heroPosition.z);
        directions.push(a);
        directions.push(b);
        directions.push(c);
        directions.push(d);

        directions.forEach(dir => {
            const rangeParticle = ParticleManager.CreateParticle(
                'particles/units/heroes/hero_nevermore/nevermore_shadowraze.vpcf',
                ParticleAttachment.WORLDORIGIN,
                undefined
            );
            ParticleManager.SetParticleControl(rangeParticle, 0, dir);
        });

        EmitSoundOn('Hero_Nevermore.Shadowraze', caster);

        const enemies = FindUnitsInRadius(
            this.GetCaster().GetTeamNumber(),
            heroPosition,
            null,
            500,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC | UnitTargetType.HERO,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );

        for (const enemy of enemies) {
            const damageTable = {
                victim: enemy,
                attacker: this.GetCaster(),
                damage: 10,
                damage_type: DamageTypes.MAGICAL,
                ability: this.GetAbility(),
            };
            ApplyDamage(damageTable);
        }
    }

    calculatePosition(angleDegrees, forward, distance, heroPosition) {
        const radians = angleDegrees * (Math.PI / 180); // 将角度转换为弧度
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        // 计算旋转后的方向向量
        const rotatedX = forward.x * cos - forward.y * sin;
        const rotatedY = forward.x * sin + forward.y * cos;
        const rotatedVector = Vector(rotatedX, rotatedY, 0).Normalized(); // 假设Z轴不变，标准化
        // 计算并返回最终位置
        return Vector(heroPosition.x + rotatedVector.x * distance, heroPosition.y + rotatedVector.y * distance, heroPosition.z);
    }
}
