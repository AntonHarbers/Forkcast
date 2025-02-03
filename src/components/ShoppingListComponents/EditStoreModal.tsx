import { useEffect } from "react"
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

export default function EditStoreModal({ editingStore, storeData, setStoreData, setEditingStore, }: { editingStore: StoreData | null, storeData: StoreData[] | [], setStoreData: React.Dispatch<React.SetStateAction<StoreData[] | []>>, setEditingStore: React.Dispatch<React.SetStateAction<StoreData | null>> }) {
    const { categories, setCategories } = useAppContext()


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<Inputs>()

    const {
        register: registerNested,
        handleSubmit: handleSubmitNested,
        formState: { errors: errosNested, isSubmitSuccessful: isSubmitSuccessfulNested },
        reset: resetNested
    } = useForm<CategoryFormInputs>()

    useEffect(() => {
        resetNested()
    }, [isSubmitSuccessfulNested, resetNested])

    const AddNewCategory: SubmitHandler<CategoryFormInputs> = (data) => {
        if (editingStore) {
            // figure out what the highest order is of all categories belonging to this store
            const highest = categories.reduce((max, cat) => {
                return cat.order > max ? cat.order : max
            }, 0)
            const newCat = new Category(v4(), data.name, highest, editingStore.uid, false, new Date().toDateString())
            setCategories([...categories, newCat])
        }
    }

    const OnDeleteStoreBtnClick = () => {
        if (editingStore) {
            const newStoreData = storeData.filter(item => item.name != editingStore.name)
            setStoreData(newStoreData)
        }
        setEditingStore(null)
    }

    const SubmitUpdateStoreForm: SubmitHandler<Inputs> = (data) => {
        if (editingStore) {
            const updatedStores = storeData.map(store => {
                return store.name === editingStore.name ? new StoreData(store.uid, data.name, data.location) : store
            })
            setStoreData(updatedStores)
        }
        setEditingStore(null)
    }

    const RemoveCategory = (categoryId: string) => {
        const newCategories = categories.map(item => {
            if (item.id === categoryId) {
                const updatedCategory = new Category(item.id, item.name, item.order, item.storeId, true, new Date().toDateString())
                return updatedCategory
            }

            return item
        })

        setCategories(newCategories)


    }

    useEffect(() => {
        if (editingStore) {
            setValue("name", editingStore.name)
            setValue('location', editingStore.location)
        }
    }, [editingStore, setValue])

    if (editingStore) {
        return (
            <div className="absolute bg-blue-200 left-[40%] w-[20%] flex flex-col">
                <div className="flex justify-between">
                    <p className="m-2 text-lg">Edit {editingStore.name}</p>
                    <button onClick={() => setEditingStore(null)} className=" text-red-800 text-lg m-2">X</button>
                </div>
                <form onSubmit={handleSubmit(SubmitUpdateStoreForm)} className="flex flex-col gap-2 p-2">
                    <input className="p-2 rounded-md" defaultValue={editingStore.name} {...register("name", { required: true })} />
                    {errors.name && <span>This field is required!</span>}
                    <input className="p-2 rounded-md" defaultValue={editingStore.location} {...register("location", { required: true })} />
                    {errors.location && <span>This field is required!</span>}
                    <div>Active Categories</div>
                    <div>{categories.filter(item => !item.isDeleted && item.storeId === editingStore.uid).map(item => <div className="flex gap-2" key={item.id}>
                        <div>{item.name}</div>
                        <button type="button" onClick={() => RemoveCategory(item.id)}>Remove</button>
                    </div>
                    )}</div>
                    <input type="submit" />
                </form>
                <form onSubmit={handleSubmitNested(AddNewCategory)}>
                    <TextInputElement placeholder="Category Name..." register={registerNested} registerName="name" required />
                    {errosNested.name && <span>This field is required</span>}
                    <SubmitInputElement submitInputText="Add Category" />
                </form>
                <button onClick={() => OnDeleteStoreBtnClick()}>DELETE STORE</button>
            </div>
        )
    } else {
        return <></>
    }

}
