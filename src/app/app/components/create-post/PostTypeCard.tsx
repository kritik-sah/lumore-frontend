interface PostTypeCardProps {
  title: string;
  description: string;
  className?: string;
  onClick: () => void;
}

const PostTypeCard = ({
  title,
  description,
  className,
  onClick,
}: PostTypeCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`w-full min-h-28 text-left border rounded-lg p-3 transition
      hover:scale-[1.01] hover:shadow-sm focus:outline-none
      ${className}`}
    >
      <p className="text-lg font-medium">{title}</p>
      <p className="">{description}</p>
    </div>
  );
};

export default PostTypeCard;
