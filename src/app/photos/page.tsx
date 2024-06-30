import photo1 from '@/common/assets/photo1.svg';
import photo2 from '@/common/assets/photo2.svg';
import photo3 from '@/common/assets/photo3.svg';
import photo4 from '@/common/assets/photo4.svg';
import photo5 from '@/common/assets/photo5.svg';
import photo6 from '@/common/assets/photo6.svg';
import Image from 'next/image';
import { DownloadButton } from './_/download-button';

export default function PhotosPage() {
  const images = [photo1, photo2, photo3, photo4, photo5, photo6];

  return (
    <div className="flex flex-wrap justify-around gap-8 p-8">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="mb-2 aspect-video max-h-48 overflow-hidden rounded-lg bg-white">
            <Image
              src={image}
              alt={`Image ${index + 1}`}
              className="h-full w-full object-contain"
            />
          </div>
          <DownloadButton image={image} />
        </div>
      ))}
    </div>
  );
}
