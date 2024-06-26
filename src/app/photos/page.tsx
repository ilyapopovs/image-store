import { DownloadButton } from './_/download-button';

export default function PhotosPage() {
  const images = [
    'https://images.pexels.com/photos/15080027/pexels-photo-15080027/free-photo-of-pile-of-firewood.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'https://images.pexels.com/photos/5591708/pexels-photo-5591708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'https://images.pexels.com/photos/15525689/pexels-photo-15525689/free-photo-of-logs-in-moss.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  ];

  return (
    <div className="flex flex-wrap justify-around gap-8 p-8">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="mb-2 aspect-video max-h-48 overflow-hidden rounded-lg">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
          <DownloadButton image={image} />
        </div>
      ))}
    </div>
  );
}
