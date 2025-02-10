export default function DateInputElement({
  defaultValue,
  value,
  onChange,
  styles,
}: {
  defaultValue: string;
  value: string;
  onChange: () => void;
  styles?: string;
}) {
  return (
    <input
      type="date"
      className={`${styles}`}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
    ></input>
  );
}
