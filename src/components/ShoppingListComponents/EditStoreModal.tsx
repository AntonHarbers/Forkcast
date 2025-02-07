import { useEffect, useMemo, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import StoreData from "../../classes/StoreData"
import { useAppContext } from "../../context/useAppContext"
import Category from "../../classes/CategoryData"
import { v4 } from "uuid"
import TextInputElement from "../FormComponents/TextInputElement"
import SubmitInputElement from "../FormComponents/SubmitInputElement"

type Inputs = {
    name: string,
    location: string,
}

type CategoryFormInputs = {
    name: string
}

export default function EditStoreModal({ editingStore, setEditingStore, }: { editingStore: StoreData | null, setEditingStore: React.Dispatch<React.SetStateAction<StoreData | null>> }) {
    const { state, dispatch } = useAppContext()
    const [currentEditingCategory, setCurrentEditingCategory] = useState<null | Category>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<Inputs>()

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

    const existingCategoriesOfStore = useMemo(() => state.categories.filter(item => !item.isDeleted && item.storeId === editingStore?.uid), [state.categories, editingStore?.uid])

    const AddNewCategory: SubmitHandler<CategoryFormInputs> = (data) => {
        if (editingStore) {
            // figure out what the highest order is of all categories belonging to this store
            const highest = existingCategoriesOfStore.reduce((max, cat) => {
                return cat.order > max ? cat.order : max
            }, 0)
            const newCat = new Category(v4(), data.name, highest + 1, editingStore.uid, false, new Date().toDateString())
            dispatch({ type: 'SET_CATEGORIES', payload: [...state.categories, newCat] })
        }
    }

    const OnDeleteStoreBtnClick = () => {
        if (editingStore) {
            dispatch({ type: "DELETE_STORE", payload: editingStore.uid })
        }
        setEditingStore(null)
        dispatch({ type: "SET_CURRENT_STORE_TAB", payload: state.stores[0] })
    }

    const SubmitUpdateStoreForm: SubmitHandler<Inputs> = (data) => {
        if (!editingStore) return
        const updatedStoreData = { ...editingStore, name: data.name, location: data.location }
        if (editingStore) {
            const updatedStores = state.stores.map(store => {
                return store.uid === editingStore.uid ? updatedStoreData : store
            })
            dispatch({ type: "SET_STORES", payload: updatedStores })
        }
        setEditingStore(null)
        if (state.currentStoreTab != null) {
            dispatch({ type: 'SET_CURRENT_STORE_TAB', payload: updatedStoreData })
        }
    }

    const SubmitUpdateCategoryNameForm: SubmitHandler<CategoryFormInputs> = (data) => {
        if (currentEditingCategory) {
            const updatedCategories = state.categories.map(cat => ({
                ...cat,
                name: cat.id === currentEditingCategory.id ? data.name : cat.name
            }))
            dispatch({ type: 'SET_CATEGORIES', payload: updatedCategories })
        }
        setCurrentEditingCategory(null)
    }

    const RemoveCategory = (categoryId: string) => {
        dispatch({ type: "DELETE_CATEGORY", payload: categoryId })
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

    if (editingStore) {
        return (
            <div className="absolute bg-blue-200 left-[40%] w-[20%] flex flex-col">
                <div className="flex justify-between">
                    <p className="m-2 text-lg">Edit {editingStore.name}</p>
                    <button onClick={() => { setEditingStore(null); setCurrentEditingCategory(null) }} className=" text-red-800 text-lg m-2">X</button>
                </div>
                <form onSubmit={handleSubmit(SubmitUpdateStoreForm)} className="flex flex-col gap-2 p-2">
                    <input className="p-2 rounded-md" defaultValue={editingStore.name} {...register("name", { required: true })} />
                    {errors.name && <span>This field is required!</span>}
                    <input className="p-2 rounded-md" defaultValue={editingStore.location} {...register("location", { required: true })} />
                    {errors.location && <span>This field is required!</span>}

                    <input type="submit" />
                </form >
                <form onSubmit={handleSubmitNested(AddNewCategory)}>
                    <TextInputElement placeholder="Category Name..." register={registerNested} registerName="name" required />
                    {errosNested.name && <span>This field is required</span>}
                    <SubmitInputElement submitInputText="Add Category" />
                </form>
                <div>Active Categories</div>
                <div>{existingCategoriesOfStore.map(item => {
                    if (currentEditingCategory != null && item.id === currentEditingCategory.id) {
                        return <form key={currentEditingCategory.id} className="flex flex-col" onSubmit={handleSubmitCategoryName(SubmitUpdateCategoryNameForm)}>
                            <TextInputElement placeholder="Name..." register={registerCategoryName} registerName="name" required defaultValue={currentEditingCategory.name} />
                            <button type="button" onClick={() => RemoveCategory(item.id)}>Remove</button>
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
    } else {
        return <></>
    }

}
