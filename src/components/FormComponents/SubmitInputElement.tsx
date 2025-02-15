export default function SubmitInputElement({ submitInputText = "Submit" }: { submitInputText?: string }) {
    return (
        <input
            className=" cursor-pointer bg-green-200 rounded-md py-2 text-xl hover:bg-slate-400 active:bg-slate-600"
            type="submit"
            value={submitInputText}
        />
    )
}