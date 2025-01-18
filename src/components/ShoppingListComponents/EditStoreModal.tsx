import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import StoreData from "../../classes/StoreData"

type Inputs = {
    name: string,
    location: string,
}

export default function EditStoreModal({ editingStore, storeData, setStoreData, setEditingStore, }: { editingStore: StoreData | null, storeData: StoreData[] | [], setStoreData: React.Dispatch<React.SetStateAction<StoreData[] | []>>, setEditingStore: React.Dispatch<React.SetStateAction<StoreData | null>> }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<Inputs>()

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
                    <input type="submit" />
                </form>
                <button onClick={() => OnDeleteStoreBtnClick()}>DELETE STORE</button>
            </div>
        )
    } else {
        return <></>
    }

}
