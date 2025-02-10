import { useMemo } from "react"
import NewUnitForm from "../components/UnitComponents/NewUnitForm"
import UnitListItem from "../components/UnitComponents/UnitListItem"
import { useAppContext } from "../context/useAppContext"
import Header from "../components/Global/Header"

function UnitPage() {

    const { state } = useAppContext()
    const existingUnits = useMemo(() => state.ingredientUnits.filter(item => !item.isDeleted), [state.ingredientUnits])

    return (
        <>
            <Header text="Units" />
            <NewUnitForm />
            <div className="flex flex-col gap-2">
                {existingUnits.map(unit => <UnitListItem key={unit.id} unit={unit} />)}
            </div>
        </>
    )
}

export default UnitPage