import { useState } from "react";
import StoreData from "../classes/StoreData";
import NewShopForm from "../components/ShoppingListComponents/NewShopForm";
import StoreTabItem from "../components/ShoppingListComponents/StoreTabItem";
import EditStoreModal from "../components/ShoppingListComponents/EditStoreModal";

export default function ShoppingListPage() {
    const [storeData, setStoreData] = useState<StoreData[] | []>([new StoreData("0", "Default", "Default"), new StoreData("1", "ALDI", "Camp Phoenix"), new StoreData("2", "REWE", "Camp Phoenix"), new StoreData("3", "GLOBUS", "-")]);
    const [selectedStore, setSelectedStore] = useState<StoreData>(storeData[0])
    const [editingStore, setEditingStore] = useState<StoreData | null>(null)

    return (
        <div>
            <div>Shopping List</div>
            <NewShopForm storeData={storeData} setStoreData={setStoreData} />
            {/* Shopping List Container */}
            <div className="bg-slate-200 w-[80%] mx-auto flex flex-col gap-10 p-2 m-10">
                {/* Shop Tabs */}
                <div>
                    <div className="flex bg-slate-200 justify-center">
                        {storeData.map(item => <StoreTabItem item={item} setEditingStore={setEditingStore} setSelectedStore={setSelectedStore} selectedStore={selectedStore} />)}
                    </div>
                </div>
                <EditStoreModal editingStore={editingStore} setEditingStore={setEditingStore} setStoreData={setStoreData} storeData={storeData} />
                {/* Filtered Ingredients */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between w-full">
                        <p className="text-xl">{selectedStore.name} Shopping List</p>
                        {selectedStore.name != "Default" && <button className="text-xl hover:font-bold active:font-mono" onClick={() => setEditingStore(selectedStore)}>Edit</button>}
                    </div>
                    <div className="text-sm">{selectedStore.location}</div>
                    <div className="my-6">
                        Ingredients...

                    </div>
                </div>
            </div>
        </div>
    )
}



