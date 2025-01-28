import StoreData from "../../classes/StoreData";

export default function StoreTabItem(
    {
        setSelectedStore,
        item,
        selectedStore,
    }
        :
        {
            setSelectedStore: React.Dispatch<React.SetStateAction<StoreData | null>>,
            item: StoreData, setEditingStore: React.Dispatch<React.SetStateAction<StoreData | null>>,
            selectedStore: StoreData | null,
        }
) {


    return (
        <div className="bg-slate-500 p-4 text-gray-400 font-bold">
            <button onClick={() => setSelectedStore(item)} className={`${selectedStore?.name === item.name && "text-white"}`}>{item.name}</button>
        </div>)
}
