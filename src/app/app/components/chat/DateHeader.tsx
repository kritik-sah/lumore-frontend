interface DateHeaderProps {
  timestamp: number;
}

export const DateHeader: React.FC<DateHeaderProps> = ({ timestamp }) => {
  return (
    <div className="flex justify-center">
      <div className="bg-ui-shade/5 px-3 py-1 rounded-full text-sm text-ui-shade/60">
        {new Date(timestamp).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};
