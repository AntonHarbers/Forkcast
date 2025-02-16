import { useMemo, useState } from "react"
import NewUnitForm from "../components/UnitComponents/NewUnitForm"
import UnitListItem from "../components/UnitComponents/UnitListItem"
import { useAppContext } from "../context/useAppContext"
import Header from "../components/Global/Header"

function UnitPage() {

    const { state } = useAppContext()
    const existingUnits = useMemo(() => state.ingredientUnits.filter(item => !item.isDeleted), [state.ingredientUnits])
    const [isShowingForm, setIsShowingForm] = useState<boolean>(false)

    return (
        <>
            <div className="flex items-center border-b justify-between mx-10">
                <Header text="Units" styles="border-none mb-0 text-center w-full" />
                <div onClick={() => setIsShowingForm(!isShowingForm)} className="pt-2 text-2xl hover:scale-110 active:scale-90 transition-all duration-100 ease-in-out hover:cursor-pointer select-none">{isShowingForm ? "➖" : "➕"}</div>
            </div>
            {isShowingForm && <NewUnitForm setIsShowingForm={setIsShowingForm} />}
            <div className="flex flex-col gap-2 mt-6">
                {existingUnits.map(unit => <UnitListItem key={unit.id} unit={unit} />)}
            </div>
        </>
    )
}

export default UnitPage