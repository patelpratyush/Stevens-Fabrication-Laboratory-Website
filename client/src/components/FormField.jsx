// Reusable form field component
export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  options, // for select inputs
  rows, // for textarea
}) {
  const inputClasses = `
    w-full px-4 py-2 border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-stevens-maroon focus:border-transparent
    ${error ? "border-red-500" : "border-gray-300"}
    ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          rows={rows || 4}
          className={inputClasses}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

/* Usage examples:
<FormField
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>

<FormField
  label="Service"
  name="service"
  type="select"
  value={service}
  onChange={(e) => setService(e.target.value)}
  options={[
    { value: "3d_print", label: "3D Printing" },
    { value: "laser_cut", label: "Laser Cutting" }
  ]}
/>
*/
