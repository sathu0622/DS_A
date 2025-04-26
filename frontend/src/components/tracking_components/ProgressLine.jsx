import React from "react";

const ProgressLine = ({ steps, currentStep, handleStepClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6 mt-10">
      <div className="relative flex items-center justify-center">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 transform -translate-y-1/2"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-green-500 transform -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div
            key={index}
            className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer"
            style={{
              left: `${(index / (steps.length - 1)) * 100}%`,
              transform: "translate(-20%, 20%)", // Center the step icon
            }}
            onClick={() => handleStepClick(index)} // Show the relevant card on click
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                index <= currentStep ? "bg-green-500" : "bg-gray-300"
              } transition-colors duration-500`}
            >
              {index + 1}
            </div>
            <p
              className={`mt-2 text-sm font-medium ${
                index <= currentStep ? "text-green-500" : "text-gray-500"
              } text-center`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressLine;