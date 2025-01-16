import { useState } from "react";
import StoreData from "../classes/StoreData";
import NewShopForm from "../components/ShoppingListComponents/NewShopForm";

export default function ShoppingListPage() {
    const [storeData, setStoreData] = useState<StoreData[] | []>([new StoreData("0", "Default", "Default")]);
    const [selectedStore, setSelectedStore] = useState<StoreData>(storeData[0])

    return (
        <div>
            <div>Shopping List</div>
            <NewShopForm storeData={storeData} setStoreData={setStoreData} />
            {/* Shopping List Container */}
            <div>
                {/* Shop Tabs */}
                <div>
                    {storeData.map(item => {
                        return <button onClick={() => setSelectedStore(item)}>{item.name}</button>
                    })}
                    <div>
                        {selectedStore?.name}
                    </div>
                </div>
                {/* Filtered Ingredients */}
                <div>
                    Ingredients...
                </div>
            </div>
        </div>
    )
}



