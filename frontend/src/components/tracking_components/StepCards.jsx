import React from "react";
import Toast from "../main_components/Toast";

const StepCards = ({ steps, visibleCard }) => {
  const [toast, setToast] = useState(null);

  return (
    <div className="mt-12 w-full max-w-2xl space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      {steps.map((step, index) => (
        <div
          key={index}
          className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 ${
            visibleCard === index ? "block" : "hidden"
          }`}
        >
          <h2 className="text-xl font-bold mb-2">{step.label}</h2>
          <p className="text-gray-600">{step.description}</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => setToast({ type: "info", message: `Action for ${step.label}` })}
          >
            Add to Card
          </button>
        </div>
      ))}
    </div>
  );
};

export default StepCards;