
export default function Header({ text, styles }: { text: string, styles: string }) {
    return (
        <div className={`w-auto text-center text-5xl m-10 text-white border-b pb-8 mx-10 ${styles}`}>{text}</div>
    )
}
