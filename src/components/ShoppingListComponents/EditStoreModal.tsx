import { useEffect, useMemo, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAppContext } from "../../context/useAppContext"
import { v4 } from "uuid"
import TextInputElement from "../FormComponents/TextInputElement"
import SubmitInputElement from "../FormComponents/SubmitInputElement"
import { CategoryFormInputs, ShopFormInputType } from "../../ts/types"
import { CategoryInterface, StoreInterface } from "../../ts/interfaces"
import FormError from "../FormComponents/FormError"
import { updateStore } from "../../DB/storesCRUD"
import { addStoreCategory, updateStoreCategories } from "../../DB/storeCategoriesCRUD"

export default function EditStoreModal({ editingStore, setEditingStore, }: { editingStore: StoreInterface | null, setEditingStore: React.Dispatch<React.SetStateAction<StoreInterface | null>> }) {
    const { state, dispatch } = useAppContext()
    const [currentEditingCategory, setCurrentEditingCategory] = useState<null | CategoryInterface>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<ShopFormInputType>()

    const {
        register: registerCategoryName,
        handleSubmit: handleSubmitCategoryName,
        setValue: setValueCategoryName
    } = useForm<CategoryFormInputs>()

    const {
        register: registerNested,
        handleSubmit: handleSubmitNested,
        formState: { errors: errosNested, isSubmitSuccessful: isSubmitSuccessfulNested },
        reset: resetNested
    } = useForm<CategoryFormInputs>()

    useEffect(() => {
        resetNested()
    }, [isSubmitSuccessfulNested, resetNested])

    const existingCategoriesOfStore = useMemo(() => state.categories.filter(item => !item.isDeleted && item.storeId === editingStore?.id), [state.categories, editingStore?.id])

    const AddNewCategory: SubmitHandler<CategoryFormInputs> = async (data) => {
        if (!editingStore) return
        try {
            const highest = existingCategoriesOfStore.reduce((max, cat) => {
                return cat.order > max ? cat.order : max
            }, 0)
            const newCat: CategoryInterface = { id: v4(), name: data.name, order: highest + 1, storeId: editingStore.id, isDeleted: false, deletedAt: new Date().toDateString() }
            await addStoreCategory(newCat)
            dispatch({ type: 'SET_CATEGORIES', payload: [...state.categories, newCat] })
        } catch (error) {
            console.error('Error adding new store category: ', error)
        }

    }

    const OnDeleteStoreBtnClick = async () => {
        if (!editingStore) return
        try {
            const deletedStore: StoreInterface = { ...editingStore, isDeleted: true, deletedAt: new Date().toDateString() }
            await updateStore(deletedStore)
            dispatch({ type: "DELETE_STORE", payload: editingStore.id })
            setEditingStore(null)
            dispatch({ type: "SET_CURRENT_STORE_TAB", payload: state.stores[0] })
        } catch (error) {
            console.error("Error Deleting Store", error)
        }
    }

    const SubmitUpdateStoreForm: SubmitHandler<ShopFormInputType> = async (data) => {
        if (!editingStore) return
        try {
            const updatedStoreData = { ...editingStore, name: data.name, location: data.location }
            const updatedStores = state.stores.map(store => {
                return store.id === editingStore.id ? updatedStoreData : store
            })
            await updateStore(updatedStoreData)
            dispatch({ type: "SET_STORES", payload: updatedStores })
            setEditingStore(null)
            if (state.currentStoreTab != null) {
                dispatch({ type: 'SET_CURRENT_STORE_TAB', payload: updatedStoreData })
            }
        } catch (error) {
            console.error("Error Updating Store", error)
        }

    }

    const SubmitUpdateCategoryNameForm: SubmitHandler<CategoryFormInputs> = async (data) => {
        if (!currentEditingCategory) return

        try {
            const newCat = { ...currentEditingCategory, name: data.name }
            const updatedCategories = state.categories.map(cat => ({
                ...cat,
                name: cat.id === currentEditingCategory.id ? data.name : cat.name
            }))
            await updateStoreCategories(newCat)
            setCurrentEditingCategory(null)
            dispatch({ type: 'SET_CATEGORIES', payload: updatedCategories })
        } catch (error) {
            console.error('Error updating store category: ', error)
        }
    }

    const RemoveCategory = async (category: CategoryInterface) => {
        try {
            const updatedCategories: CategoryInterface = { ...category, isDeleted: true, deletedAt: new Date().toDateString() }
            await updateStoreCategories(updatedCategories)
            dispatch({ type: "DELETE_CATEGORY", payload: category.id })
        } catch (error) {
            console.error('Error deleting store category: ', error)
        }
    }

    useEffect(() => {
        if (editingStore) {
            setValue("name", editingStore.name)
            setValue('location', editingStore.location)
        }
    }, [editingStore, setValue])

    useEffect(() => {
        if (currentEditingCategory) {
            setValueCategoryName("name", currentEditingCategory.name)
        }
    }, [currentEditingCategory, setValueCategoryName])

    return editingStore && (
        <div className="bg-slate-700/60 backdrop-blur-md rounded-md text-white w-[90%] mx-auto flex flex-col items-center justify-center">
            <div className="flex justify-between w-[90%]">
                <p className="m-2 text-3xl">Edit {editingStore.name}</p>
                <button onClick={() => { setEditingStore(null); setCurrentEditingCategory(null) }} className=" text-2xl m-2 hover:scale-125 active:scale-90 transition-all ease-in-out">❌</button>
            </div>
            <form onSubmit={handleSubmit(SubmitUpdateStoreForm)} className="flex flex-col gap-2 p-2">
                <input className="p-2 text-slate-700 text-center rounded-md text-xl w-[90%] mx-auto placeholder:text-slate-500" placeholder="Name..." defaultValue={editingStore.name} {...register("name", { required: true })} />
                {errors.name && <FormError />}
                <input className="p-2 text-slate-700 text-xl text-center rounded-md w-[90%] mx-auto placeholder:text-slate-500" placeholder="Location..." defaultValue={editingStore.location} {...register("location", { required: true })} />
                {errors.location && <FormError />}
                <SubmitInputElement submitInputText="📝" styles="" />
            </form >
            <button className="my-2 text-2xl bg-red-500 px-2 rounded-md hover:bg-red-700 active:bg-red-300 transition-all ease-in-out" onClick={() => OnDeleteStoreBtnClick()}>DELETE STORE</button>
            <form className="flex items-center" onSubmit={handleSubmitNested(AddNewCategory)}>
                <TextInputElement styles="mx-0 text-center text-xl" placeholder="New category name..." register={registerNested} registerName="name" required />
                {errosNested.name && <FormError />}
                <SubmitInputElement styles="px-2" submitInputText="➕" />
            </form>

            <div className="text-2xl my-2 underline
            ">Active Categories</div>
            <div className="flex w-[90%] flex-col gap-2 text-xl">{existingCategoriesOfStore.map(item => {
                if (currentEditingCategory != null && item.id === currentEditingCategory.id) {
                    return <form key={currentEditingCategory.id} className="flex items-center justify-between gap-2" onSubmit={handleSubmitCategoryName(SubmitUpdateCategoryNameForm)}>
                        <TextInputElement placeholder="Name..." register={registerCategoryName} registerName="name" required defaultValue={currentEditingCategory.name} />
                        <div className="flex gap-2">
                            <SubmitInputElement
                                styles="bg-transparent hover:bg-transparent scale-110 hover:scale-125 active:scale-90 transition-all ease-in-out" submitInputText="📝" />
                            <button className="px-2 py-2 rounded-md bg-red-500 hover:bg-red-800 active:bg-red-200" type="button" onClick={() => RemoveCategory(item)}>DELETE</button>

                        </div>

                    </form>
                }
                return <div className="flex gap-2 justify-between items-center pb-1 border-b border-b-slate-200 my-2" key={item.id}>
                    <div>{item.name}</div>
                    <button
                        className="hover:scale-125 active:scale-90 transition-all duration-100 ease-in-out"
                        type="button" onClick={() => { setCurrentEditingCategory(item) }}>✏</button>
                </div>
            }
            )}</div>
        </div >
    )
}
