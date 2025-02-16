import { useAppContext } from "../../context/useAppContext";
import { StoreInterface } from "../../ts/interfaces";

export default function StoreTabItem({ item }: { item: StoreInterface, }) {
    const { state, dispatch } = useAppContext()

    return (
        <div className="select-none bg-slate-500 rounded-md mx-1 p-4 text-gray-400 font-bold">
            <button
                onClick={() => dispatch({ type: "SET_CURRENT_STORE_TAB", payload: item })}
                className={`${state.currentStoreTab?.name === item.name && "text-white"}`}
            >
                {item.name}
            </button>
        </div>)
}
