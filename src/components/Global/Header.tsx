
export default function Header({ text }: { text: string }) {
    return (
        <div className="w-auto text-center text-5xl m-10 text-white border-b pb-8 mx-10">{text}</div>
    )
}
