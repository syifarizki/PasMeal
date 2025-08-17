import PrimaryButton from "./PrimaryButton"; 

const Notification = ({
  show,
  onClose,
  iconImage,
  title,
  message,
  buttonText = "Tutup",
  buttonAction,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 text-center max-w-sm w-full shadow-lg">
        {iconImage && (
          <img src={iconImage} alt="icon" className="mx-auto h-18 w-20" />
        )}
        <h2 className="text-xl font-extrabold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>

     
          <PrimaryButton
            text={buttonText}
            onClick={buttonAction || onClose}
            className="w-full"
          />
        
      </div>
    </div>
  );
}

export default Notification;