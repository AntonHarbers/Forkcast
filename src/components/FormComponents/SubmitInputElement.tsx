export default function SubmitInputElement({ submitInputText = "Submit", styles = "" }: { submitInputText?: string, styles?: string }) {
    return (
        <input
            className={`cursor-pointer bg-green-200 rounded-md mx-2 py-2 text-xl hover:bg-slate-400 active:bg-slate-600 ${styles}`}
            type="submit"
            value={submitInputText}
        />
    )
}