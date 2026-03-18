function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-transparent hover:border-indigo-500 transition">
      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
        <span className="text-xl"> {icon} </span>
      </div>
      <h3 className="font-bold text-gray-900 mb-2 "> {title} </h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    
  )
}

export default FeatureCard