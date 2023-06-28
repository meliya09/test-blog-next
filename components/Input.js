const Input = ({ field, form, ...props }) => {
  return (
    <input
      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-500"
      {...field}
      {...props}
    />
  );
};

export default Input;
