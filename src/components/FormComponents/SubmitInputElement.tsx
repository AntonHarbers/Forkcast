export default function SubmitInputElement({ submitInputText = "Submit" }: { submitInputText?: string }) {
    return (
        <input
            className=" cursor-pointer bg-slate-200 rounded-md hover:bg-slate-400 active:bg-slate-600"
            type="submit"
            value={submitInputText}
        />
    )
}