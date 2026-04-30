function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center space-y-3 bg-muted/30 p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-center">{icon}</div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}

export default FeatureCard;
