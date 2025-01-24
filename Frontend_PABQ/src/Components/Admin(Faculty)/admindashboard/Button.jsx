const Button = ({ children, type = 'button', onClick }) => (
    <button
        type={type}
        onClick={onClick}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
        {children}
    </button>
);

export default Button;