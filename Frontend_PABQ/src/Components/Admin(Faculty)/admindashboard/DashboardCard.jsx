const DashboardCard = ({ title, value, handleOpenModal, description }) => (
    <div
        className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
        onClick={handleOpenModal} 
    >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {value !== undefined && <p className="text-3xl font-bold text-blue-600">{value}</p>}
        {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
    </div>
);

export default DashboardCard;