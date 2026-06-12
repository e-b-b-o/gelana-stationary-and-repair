import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionTo,
  onAction,
}) {
  return (
    <div className="flex-1 min-h-[calc(100vh-60px)] py-20 flex flex-col justify-center items-center text-center px-4 animate-fade-in-up">
      {Icon && <Icon className="w-20 h-20 text-gray-300 mb-6 drop-shadow-sm" />}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-3">
        {title}
      </h2>
      <p className="text-gray-500 mb-8 max-w-md text-sm md:text-base leading-relaxed">
        {description}
      </p>
      {actionText && (
        <Button
          variant="primary"
          to={actionTo}
          onClick={onAction}
          size="lg"
          className="rounded-md sm:px-10 shadow-sm"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
