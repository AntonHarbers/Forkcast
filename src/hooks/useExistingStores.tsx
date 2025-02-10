import { useMemo } from "react";
import { AppState } from "../ts/types";

export default function useExistingStores(state: AppState) {
    return useMemo(() => state.stores.filter(item => !item.isDeleted), [state.stores])
}