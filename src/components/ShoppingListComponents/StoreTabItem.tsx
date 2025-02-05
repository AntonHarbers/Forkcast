import StoreData from "../../classes/StoreData";
import { useAppContext } from "../../context/useAppContext";

export default function StoreTabItem({ item }: { item: StoreData, }) {
    const { state, dispatch } = useAppContext()

    return (
        <div className="bg-slate-500 p-4 text-gray-400 font-bold">
            <button onClick={() => dispatch({ type: "SET_CURRENT_STORE_TAB", payload: item })} className={`${state.currentStoreTab?.name === item.name && "text-white"}`}>{item.name}</button>
        </div>)
}
