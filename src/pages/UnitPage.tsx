import NewUnitForm from "../components/UnitComponents/NewUnitForm"
import UnitListItem from "../components/UnitComponents/UnitListItem"
import { useAppContext } from "../context/useAppContext"

function UnitPage() {

    const { state } = useAppContext()

    return (
        <div>
            <NewUnitForm />
            <div className="flex flex-col gap-2">
                {state.ingredientUnits.map(unit => !unit.isDeleted &&
                    <UnitListItem key={unit.id} unit={unit} />
                )}
            </div>
        </div>
    )
}

export default UnitPage