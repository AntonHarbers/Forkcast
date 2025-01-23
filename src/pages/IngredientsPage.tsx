import NewIngredientForm from "../components/IngredientsPageComponent/NewIngredientForm";
import { SubmitHandler } from "react-hook-form";
import IngredientBlueprint from "../classes/IngredientBlueprint";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";

type Inputs = {
    name: string,
    storeUid: string,
}


export default function IngredientsPage() {


    const HandleNewIngredientFormSubmit: SubmitHandler<Inputs> = (data) => {
        setIngredientBlueprints([...ingredientBlueprints, new IngredientBlueprint(v4(), data.name, data.storeUid)])
    }

    const { ingredientBlueprints, setIngredientBlueprints } = useAppContext()

    return (
        <div>
            <h1>Ingredients</h1>
            <div>
                <NewIngredientForm onSubmit={HandleNewIngredientFormSubmit} />
            </div>
            {ingredientBlueprints.map(item => {
                return (
                    <div key={item.uid}>{item.name}</div>
                )
            })}
        </div>
    )
}
