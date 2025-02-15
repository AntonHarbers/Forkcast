export default function DateInputElement({
  value,
  onChange,
  styles,
}: {
  value: string;
  onChange: (newDate: Date) => void;
  styles?: string;
}) {
  return (
    <input
      type="date"
      className={`rounded-md px-2 ${styles}`}
      value={value}
      onChange={(e) => onChange(new Date(e.target.value))}
    ></input>
  );
}
