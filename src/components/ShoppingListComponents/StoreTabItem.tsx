import StoreData from "../../classes/StoreData";

export default function StoreTabItem({ setSelectedStore, item, setEditingStore }: { setSelectedStore: React.Dispatch<React.SetStateAction<StoreData>>, item: StoreData, setEditingStore: React.Dispatch<React.SetStateAction<StoreData | null>> }) {
    return (
        <div>
            <button onClick={() => setSelectedStore(item)}>{item.name}</button>
            {item.name != "Default" && <button className="mx-2" onClick={() => setEditingStore(item)}>Edit</button>}
        </div>)
}
