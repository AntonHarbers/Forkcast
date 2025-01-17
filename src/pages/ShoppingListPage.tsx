import { useState } from "react";
import StoreData from "../classes/StoreData";
import NewShopForm from "../components/ShoppingListComponents/NewShopForm";
import StoreTabItem from "../components/ShoppingListComponents/StoreTabItem";
import EditStoreModal from "../components/ShoppingListComponents/EditStoreModal";

export default function ShoppingListPage() {
    const [storeData, setStoreData] = useState<StoreData[] | []>([new StoreData("0", "Default", "Default")]);
    const [selectedStore, setSelectedStore] = useState<StoreData>(storeData[0])
    const [editingStore, setEditingStore] = useState<StoreData | null>(null)

    return (
        <div>
            <div>Shopping List</div>
            <NewShopForm storeData={storeData} setStoreData={setStoreData} />
            {/* Shopping List Container */}
            <div>
                {/* Shop Tabs */}
                <div>
                    <div className="flex gap-4">
                        {storeData.map(item => <StoreTabItem item={item} setEditingStore={setEditingStore} setSelectedStore={setSelectedStore} />)}
                    </div>
                    <div>
                        {selectedStore?.name}
                    </div>
                </div>
                <EditStoreModal editingStore={editingStore} setEditingStore={setEditingStore} setStoreData={setStoreData} storeData={storeData} />
                {/* Filtered Ingredients */}
                <div>
                    Ingredients...
                </div>
            </div>
        </div>
    )
}



