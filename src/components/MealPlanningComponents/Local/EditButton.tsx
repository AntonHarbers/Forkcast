
export default function EditMealButton({ OnClick }: { OnClick: () => void, }) {
    return (
        <button
            onClick={OnClick}
            className="hover:scale-125 transition-all ease-in-out active:scale-90"
            type="button"
        >
            ✏️
        </button>
    )
}
