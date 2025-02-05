import Unit from "../classes/UnitData"
import NewUnitForm from "../components/UnitComponents/NewUnitForm"
import UnitListItem from "../components/UnitComponents/UnitListItem"
import { useAppContext } from "../context/useAppContext"

function UnitPage() {

    const { state, dispatch } = useAppContext()

    // delete units

    const HandleUnitDelete = (unitId: string) => {
        const newUnits = state.ingredientUnits.map(unit => unit.id === unitId ? new Unit(unit.id, unit.name, true, new Date().toDateString()) : unit)

        dispatch({ type: "SET_INGREDIENT_UNITS", payload: newUnits })
    }

    // update units


    return (
        <div>
            <NewUnitForm />
            <div className="flex flex-col gap-2">
                {state.ingredientUnits.map(unit => !unit.isDeleted &&
                    <UnitListItem key={unit.id} unit={unit} HandleUnitDelete={HandleUnitDelete} />
                )}
            </div>
        </div>
    )
}

export default UnitPage