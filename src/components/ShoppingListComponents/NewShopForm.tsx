import { SubmitHandler, useForm } from "react-hook-form";
import StoreData from "../../classes/StoreData";

type Inputs = {
    name: string;
    location: string;
}

export default function NewShopForm({ storeData, setStoreData }: { storeData: [] | StoreData[], setStoreData: React.Dispatch<React.SetStateAction<[] | StoreData[]>> }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const SubmitNewShopForm: SubmitHandler<Inputs> = (data) => {
        const newStore = new StoreData("1", data.name, data.location)
        setStoreData([...storeData, newStore])
    }

    return (
        <>
            <form onSubmit={handleSubmit(SubmitNewShopForm)}>
                <input defaultValue="Name..." {...register("name", { required: true })} />
                {errors.name && <span>This field is required!</span>}
                <input defaultValue="Location..." {...register("location", { required: true })} />
                {errors.location && <span>This field is required!</span>}
                <input type="submit" />
            </form>
        </>
    )
}
