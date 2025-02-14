import { SubmitHandler, useForm } from "react-hook-form";
import TextInputElement from "../FormComponents/TextInputElement";
import SubmitInputElement from "../FormComponents/SubmitInputElement";
import { useEffect } from "react";
import { v4 } from "uuid";
import { ShopFormInputType } from "../../ts/types";
import { useAppContext } from "../../context/useAppContext";
import { StoreInterface } from "../../ts/interfaces";
import FormError from "../FormComponents/FormError";
import { addStore } from "../../DB/storesCRUD";


export default function NewShopForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        reset
    } = useForm<ShopFormInputType>();

    const { dispatch, state } = useAppContext()

    const SubmitNewShopForm: SubmitHandler<ShopFormInputType> = async (data) => {
        try {
            const newStore: StoreInterface = {
                id: v4(),
                name: data.name,
                location: data.location,
                isDeleted: false,
                deletedAt: new Date().toDateString()
            }
            await addStore(newStore)
            dispatch({ type: "SET_STORES", payload: [...state.stores, newStore] })
            dispatch({ type: "SET_CURRENT_STORE_TAB", payload: newStore })
        } catch (error) {
            console.error("Error adding new store: ", error)
        }
    }

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    return (
        <div>
            <form className="flex flex-col w-96 mx-auto" onSubmit={handleSubmit(SubmitNewShopForm)}>
                <TextInputElement register={register} placeholder={"Name..."} registerName={'name'} required={true} />
                {errors.name && <FormError />}
                <TextInputElement register={register} placeholder={"Location..."} registerName={"location"} required={false} />
                {errors.location && <FormError />}
                <SubmitInputElement submitInputText="Add new Store" />
            </form>
        </div>
    )
}

