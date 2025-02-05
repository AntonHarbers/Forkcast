import { SubmitHandler, useForm } from "react-hook-form";
import StoreData from "../../classes/StoreData";
import TextInputElement from "../FormComponents/TextInputElement";
import SubmitInputElement from "../FormComponents/SubmitInputElement";
import { useEffect } from "react";
import { v4 } from "uuid";
import { ShopFormInputType } from "../../types";
import { useAppContext } from "../../context/useAppContext";


export default function NewShopForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        reset
    } = useForm<ShopFormInputType>();

    const { dispatch, state } = useAppContext()

    const SubmitNewShopForm: SubmitHandler<ShopFormInputType> = (data) => {
        const newStore = new StoreData(v4(), data.name, data.location, false, new Date().toDateString())
        dispatch({ type: "SET_STORES", payload: [...state.stores, newStore] })
    }

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    return (
        <div>
            <form className="flex flex-col w-96 mx-auto" onSubmit={handleSubmit(SubmitNewShopForm)}>
                <TextInputElement register={register} placeholder={"Name..."} registerName={'name'} required={true} />
                {errors.name && <span>This field is required!</span>}
                <TextInputElement register={register} placeholder={"Location..."} registerName={"location"} required={false} />
                {errors.location && <span>This field is required!</span>}
                <SubmitInputElement submitInputText="Add new Store" />
            </form>
        </div>
    )
}

