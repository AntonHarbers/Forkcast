export default function DailyViewMeals({
  index,
  name,
}: {
  index: number;
  name: string;
}) {
  return (
    <div className="w-auto border-b p-2 m-10 text-2xl text-center" key={index}>{name}</div>
  );
}
