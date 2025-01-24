const Modal = ({ title, children, handleCloseModal }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            {children}
        </div>
    </div>
);

export default Modal;