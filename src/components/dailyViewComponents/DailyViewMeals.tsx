export default function DailyViewMeals({
  index,
  name,
}: {
  index: number;
  name: string;
}) {
  return (
    <div>
      <div key={index}>{name}</div>
    </div>
  );
}
