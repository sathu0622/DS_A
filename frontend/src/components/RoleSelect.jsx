const RoleSelect = ({ value, onChange, name }) => (
  <div className="mb-4">
    <label className="block text-red-600 mb-1 font-semibold">Role</label>
    <select
      name={name} // ✅ Add this line
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      <option value="">Select role</option>
      <option value="admin">Admin</option>
      <option value="restaurant">Restaurant</option>
      <option value="customer">Customer</option>
    </select>
  </div>
);
export default RoleSelect;
