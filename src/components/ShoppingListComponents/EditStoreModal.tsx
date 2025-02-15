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
        <div className="absolute bg-blue-200 left-[40%] w-[20%] flex flex-col">
            <div className="flex justify-between">
                <p className="m-2 text-lg">Edit {editingStore.name}</p>
                <button onClick={() => { setEditingStore(null); setCurrentEditingCategory(null) }} className=" text-red-800 text-lg m-2">X</button>
            </div>
            <form onSubmit={handleSubmit(SubmitUpdateStoreForm)} className="flex flex-col gap-2 p-2">
                <input className="p-2 rounded-md" defaultValue={editingStore.name} {...register("name", { required: true })} />
                {errors.name && <FormError />}
                <input className="p-2 rounded-md" defaultValue={editingStore.location} {...register("location", { required: true })} />
                {errors.location && <FormError />}
                <input type="submit" />
            </form >
            <form onSubmit={handleSubmitNested(AddNewCategory)}>
                <TextInputElement placeholder="Category Name..." register={registerNested} registerName="name" required />
                {errosNested.name && <FormError />}
                <SubmitInputElement submitInputText="Add Category" />
            </form>
            <div>Active Categories</div>
            <div>{existingCategoriesOfStore.map(item => {
                if (currentEditingCategory != null && item.id === currentEditingCategory.id) {
                    return <form key={currentEditingCategory.id} className="flex flex-col" onSubmit={handleSubmitCategoryName(SubmitUpdateCategoryNameForm)}>
                        <TextInputElement placeholder="Name..." register={registerCategoryName} registerName="name" required defaultValue={currentEditingCategory.name} />
                        <button type="button" onClick={() => RemoveCategory(item)}>Remove</button>
                        <SubmitInputElement submitInputText="Submit" />
                    </form>
                }
                return <div className="flex gap-2" key={item.id}>
                    <div>{item.name}</div>
                    <button type="button" onClick={() => { setCurrentEditingCategory(item) }}>Edit</button>
                </div>
            }
            )}</div>
            <button onClick={() => OnDeleteStoreBtnClick()}>DELETE STORE</button>
        </div >
    )
}
