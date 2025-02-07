import { useMemo } from "react"
import NewUnitForm from "../components/UnitComponents/NewUnitForm"
import UnitListItem from "../components/UnitComponents/UnitListItem"
import { useAppContext } from "../context/useAppContext"

function UnitPage() {

    const { state } = useAppContext()
    const existingUnits = useMemo(() => state.ingredientUnits.filter(item => !item.isDeleted), [state.ingredientUnits])
    return (
        <div>
            <NewUnitForm />
            <div className="flex flex-col gap-2">
                {existingUnits.map(unit => <UnitListItem key={unit.id} unit={unit} />)}
            </div>
        </div>
    )
}

export default UnitPage