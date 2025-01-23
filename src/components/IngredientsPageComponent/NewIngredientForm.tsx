import { useForm } from "react-hook-form"

type Inputs = {
    name: string,
    storeUid: string,
}

export default function NewIngredientForm({ onSubmit }: { onSubmit: (data: Inputs) => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="Name..." {...register('name', { required: true })} />
            {/* A select with every possible store as an option */}
            {errors.name && <span>This field is required!</span>}
            <input type="submit" />
        </form>
    )
}
