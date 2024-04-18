export class UniqueWeapon {
    constructor() {
        ListenToGameEvent(
            'dota_item_purchased',
            event => {
                const itemName = event.itemname;
                const player = PlayerResource.GetPlayer(0);
                const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
                const item = hero.FindItemInInventory(itemName);
                this.processItem(item);
            },
            null
        );
        ListenToGameEvent(
            'dota_item_picked_up',
            event => {
                const itemEntIndex = event.ItemEntityIndex;
                const item = EntIndexToHScript(itemEntIndex) as CDOTA_Item;
                this.processItem(item);
            },
            null
        );
    }

    processItem(item: CDOTA_Item) {
        const player = PlayerResource.GetPlayer(0);
        const hero = player.GetAssignedHero() as CDOTA_BaseNPC_Hero;
        const vector = hero.GetAbsOrigin();
        const itemName = item.GetName();
        item.Destroy();
        const item2 = hero.AddItemByName(itemName);

        // 检查英雄是否具备指定的三件装备
        const requiredItems = ['item_cly', 'item_zfbs', 'item_mfj'];
        const hasAllRequiredItems = requiredItems.every(itemName => hero.HasItemInInventory(itemName));

        // 如果具备所需的三件装备
        if (hasAllRequiredItems) {
            // 需要合成的装备列表
            const itemsToCombine = ['item_hszr', 'item_ddsc', 'item_sszj'];

            // 随机选择一件装备进行合成+--
            const randomIndex = Math.floor(Math.random() * itemsToCombine.length);
            const itemToCreate = itemsToCombine[randomIndex];

            // 移除所需的三件装备并添加新的装备
            requiredItems.forEach(itemName => {
                const item = hero.FindItemInInventory(itemName);
                if (item) {
                    item.Destroy();
                }
            });

            hero.AddItemByName(itemToCreate) as CDOTA_Item;
        }
        Timers.CreateTimer(0.2, () => {
            const num = hero.GetNumItemsInInventory();
            let hasHszr = false;
            const hasSszr = false;
            for (let i = 0; i < 9; i++) {
                if (!hero.GetItemInSlot(i)) {
                    continue;
                }
                const item = hero.GetItemInSlot(i);
                const itemName = item.GetName();
                if (item.GetName().includes('item_hszr')) {
                    if (hasHszr) {
                        hero.RemoveItem(item);
                        CreateItemOnPositionSync(vector, CreateItem('item_hszr', null, null));
                    } else {
                        hasHszr = true;
                    }
                }
                if (item.GetName().includes('item_sszj')) {
                    if (hasHszr) {
                        hero.RemoveItem(item);
                        CreateItemOnPositionSync(vector, CreateItem('item_sszj', null, null));
                    } else {
                        hasHszr = true;
                    }
                }
            }

            //死神 和 火神 只能帶一把
            if (hero.HasItemInInventory('item_hszr') && hero.HasItemInInventory('item_sszj')) {
                //丢掉刚捡起来的装备
                const ddsc = hero.FindItemInInventory('item_sszj');
                hero.RemoveItem(ddsc);
                CreateItemOnPositionSync(vector, CreateItem('item_sszj', null, null));
            }
            if (hero.HasItemInInventory('item_ddsc')) {
                const ddsc = hero.FindItemInInventory('item_ddsc');
                hero.RemoveItem(ddsc);
                CreateItemOnPositionSync(vector, CreateItem('item_ddsc', null, null));
            }
        });
    }
}
