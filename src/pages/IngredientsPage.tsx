import NewIngredientForm from "../components/IngredientsPageComponent/NewIngredientForm";
import { SubmitHandler } from "react-hook-form";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";
import EditIngredientModal from "../components/IngredientsPageComponent/EditIngredientModal";
import React, { useEffect, useMemo, useState } from "react";
import IngredientListItem from "../components/IngredientsPageComponent/IngredientListItem";
import { IngredientFormInputs } from "../ts/types";
import { CategoryInterface, IngredientBlueprintInterface, StoreInterface, UnitInterface } from "../ts/interfaces";
import Header from "../components/Global/Header";
import { addIngredientBlueprint } from "../DB/ingredientBlueprintsCRUD";
import debounce from "lodash.debounce";

// then we filter based on the filters
// AND THEN we search
// display the searched ingredients

export default function IngredientsPage() {
    const { state, dispatch } = useAppContext()
    const [editingIngredientBlueprint, setEditingIngredientBlueprint] = useState<IngredientBlueprintInterface | null>(null)

    const [isShowingNewIngredientForm, setIsShowingNewIngredientForm] = useState<boolean>(false)
    const [isAlphabeticSort, setIsAlphabeticSort] = useState<boolean>(true)
    const [unitFilter, setUnitFilter] = useState<string>("")
    const [categoryFilter, setCategoryFilter] = useState<string>("")
    const [storeFilter, setStoreFilter] = useState<string>("")

    // first we get existing
    const existingIngredientBlueprints = useMemo(() => state.ingredientBlueprints.filter(item => !item.isDeleted).sort((a, b) => isAlphabeticSort ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)), [state.ingredientBlueprints, isAlphabeticSort])
    const existingUnits = useMemo(() => state.ingredientUnits.filter(item => !item.isDeleted), [state.ingredientUnits])
    const existingCategories = useMemo(() => state.categories.filter(cat => !cat.isDeleted), [state.categories])
    const existingStores = useMemo(() => state.stores.filter(store => !store.isDeleted), [state.stores])

    // Then we filter
    const [isShowingFilterForm, setIsShowingFilterForm] = useState<boolean>(false)
    const filteredIngredients = useMemo(() => {
        return [...existingIngredientBlueprints].filter(ingredient => {
            return (
                (unitFilter != "" ? ingredient.unitId === unitFilter : true) &&
                (categoryFilter != "" ? ingredient.categoryId === categoryFilter : true) &&
                (storeFilter != "" ? ingredient.storeUid === storeFilter : true)
            );
        })
    }, [categoryFilter, existingIngredientBlueprints, storeFilter, unitFilter])

    // finally we apply the search
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [searchedIngredients, setSearchedIngredients] = useState<IngredientBlueprintInterface[]>([])

    useEffect(() => setSearchedIngredients(filteredIngredients), [filteredIngredients])

    const debouncedFilter = useMemo(
        () =>
            debounce(
                (
                    value: string,
                    ingredientBlueprints: IngredientBlueprintInterface[]
                ) => {
                    if (!value) {
                        setSearchedIngredients(ingredientBlueprints)
                        return;
                    }
                    const regex = new RegExp(value, "i");
                    const filtered = [...ingredientBlueprints].filter(
                        (ingredient) => regex.test(ingredient.name) && !ingredient.isDeleted
                    );
                    setSearchedIngredients(filtered);
                },
                250
            )
        ,
        []
    );

    const HandleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        debouncedFilter(val, filteredIngredients);
    };

    const HandleNewIngredientFormSubmit: SubmitHandler<IngredientFormInputs> = async (data) => {
        try {
            if (!data.categoryId) data.categoryId = null
            const newIngredient: IngredientBlueprintInterface = { ...data, id: v4(), deletedAt: new Date().toDateString(), isDeleted: false }
            await addIngredientBlueprint(newIngredient)
            dispatch({ type: 'SET_INGREDIENT_BLUEPRINTS', payload: [...state.ingredientBlueprints, newIngredient] })
        } catch (error) {
            console.error("Error adding new ingredient blueprint: ", error)
        }

    }


    return (
        <div className="relative">
            <div className="flex items-center border-b justify-between mx-10">
                <Header text="Ingredients" styles="border-none mb-0 text-center w-full" />
                <div onClick={() => setIsShowingNewIngredientForm(!isShowingNewIngredientForm)} className="pt-2 text-2xl hover:scale-110 active:scale-90 transition-all duration-100 ease-in-out hover:cursor-pointer select-none">{isShowingNewIngredientForm ? "➖" : "➕"}</div>
            </div>
            {isShowingNewIngredientForm &&
                <div className="justify-center flex ">
                    <NewIngredientForm onSubmit={HandleNewIngredientFormSubmit} />
                </div>
            }
            <div className="flex bg-[#aaa] w-[50%] min-w-[300px] rounded-md mx-auto my-2 items-center">
                <input
                    id="searchInput"
                    type="text"
                    value={searchTerm}
                    onChange={HandleSearchChange}
                    className="p-2 rounded-md w-full bg-[#aaa] text-white outline-none text-center text-2xl"
                />
                <label htmlFor="searchInput" className="p-1 text-lg hover:cursor-pointer">🔍</label>
                <button className="text-black hover:text-white active:text-slate-600" onClick={() => setIsShowingFilterForm(!isShowingFilterForm)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                    </svg>

                </button>
            </div>

            <div className="text-white mx-auto text-center text-2xl flex justify-center">

                {/* DROPDOWNS FOR UNIT/CATEGORIES/SHOP when picked filter the ingredients for only that unit */}
            </div>
            {searchedIngredients.map(item => {
                return (
                    <IngredientListItem key={item.id} item={item} setEditingIngredientBlueprint={setEditingIngredientBlueprint} />
                )
            })}
            <div className="fixed w-full top-[20vh]">
                <EditIngredientModal
                    editingIngredientBlueprint={editingIngredientBlueprint}
                    setEditingIngredientBlueprint={setEditingIngredientBlueprint}
                />
            </div>
            {isShowingFilterForm && <div className="fixed flex-col gap-2 py-4 text-slate-700 w-[50%] left-[25%] border flex items-center justify-center top-[30%] bg-white/60 backdrop-blur-sm rounded-md">
                <div className="text-3xl">Filters</div>
                <div className="flex gap-2">
                    <button onClick={() => setIsAlphabeticSort(true)} className={`${isAlphabeticSort && "font-bold border"} p-2 rounded-md`}>A - Z</button>
                    <button onClick={() => setIsAlphabeticSort(false)} className={`${!isAlphabeticSort && 'font-bold border'} p-2 rounded-md`}>Z - A</button>
                </div>
                <FilterDropdownSelect arr={existingStores} val={storeFilter} onChange={setStoreFilter} labelText="Stores" />
                <FilterDropdownSelect arr={existingUnits} val={unitFilter} onChange={setUnitFilter} labelText="Units" />
                <FilterDropdownSelect arr={existingCategories} val={categoryFilter} onChange={setCategoryFilter} labelText="Categories" />
                <button onClick={() => {
                    setCategoryFilter("")
                    setUnitFilter("")
                    setStoreFilter("")
                    setIsAlphabeticSort(true)
                }} className="bg-orange-300 p-2 px-4 rounded-md w-[80%] my-2 hover:bg-orange-500 active:bg-orange-100">Reset</button>
            </div>}
        </div>
    )
}

const FilterDropdownSelect = ({ val, labelText, onChange, arr }: { val: string, labelText: string, onChange: React.Dispatch<React.SetStateAction<string>>, arr: UnitInterface[] | CategoryInterface[] | StoreInterface[] }) => {
    return (
        <div className="flex w-[80%] justify-between">
            <label className="text-2xl" htmlFor="storeSelect">{labelText}:</label>
            <select name="storeSelect" id="storeSelect" className="w-[60%] text-center min-w-32 rounded-md" value={val} onChange={(e) => {
                onChange(e.target.value)
            }}>
                <option value="">All</option>
                {arr.map(item => {
                    return <option value={item.id} key={item.id}>{item.name}</option>
                })}
            </select>
        </div>
    )
}