import Unit from "../classes/UnitData"
import NewUnitForm from "../components/UnitComponents/NewUnitForm"
import UnitListItem from "../components/UnitComponents/UnitListItem"
import { useAppContext } from "../context/useAppContext"

function UnitPage() {

    const { ingredientUnits, setIngredientUnits } = useAppContext()

    // delete units

    const HandleUnitDelete = (unitId: string) => {
        const newUnits = ingredientUnits.map(unit => unit.id === unitId ? new Unit(unit.id, unit.name, true, new Date().toDateString()) : unit)
        setIngredientUnits(newUnits)
    }

    // update units


    return (
        <div>
            <NewUnitForm />
            <div className="flex flex-col gap-2">
                {ingredientUnits.map(unit => !unit.isDeleted &&
                    <UnitListItem key={unit.id} unit={unit} HandleUnitDelete={HandleUnitDelete}/>
                )}
            </div>
        </div>
    )
}

export default UnitPage