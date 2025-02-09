
export default function EditMealButton({ OnClick, text }: { OnClick: () => void, text: string }) {
    return (
        <button
            onClick={OnClick}
            className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500 p-1 text-lg rounded-md"
            type="button"
        >
            {text}
        </button>
    )
}
