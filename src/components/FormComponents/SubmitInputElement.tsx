export default function SubmitInputElement({ submitInputText = "Submit" }: { submitInputText?: string }) {
    return (
        <input type="submit" value={submitInputText} />
    )
}