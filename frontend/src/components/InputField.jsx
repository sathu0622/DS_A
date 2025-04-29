const InputField = ({ label, type, value, onChange, name }) => (
    <div className="mb-4">
    <label className="block text-red-600 mb-1 font-semibold">{label}</label>
      <input
        name={name} // ✅ this line is important
        type={type}
        value={value}
        onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
  export default InputField;
  